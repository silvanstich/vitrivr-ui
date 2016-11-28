var tiler = undefined;
var host = 'http://localhost/vitrivr-ui/thumbnails/';
var level = undefined;
var featureName = '';
var lastClickedId = '';
var fromSearchShotId = undefined;
var topLevels = {};
var centers = {};

$(document).ready(function(){
  $('body').on('click', 'img', function(event){
    if($('#container').hasClass('noClick')){
      $('#container').removeClass('noClick');
      return;
    }

    var img = $(this);
    var src = img.attr('src');
    var id = src.replace(host, '').replace('.jpg', '');

    if(event.altKey && event.shiftKey){ // call search of the vitrivr stack
      $('#colorsketchbutton').click();
      var shotId = img.attr('data-shotid');
      search(shotId);

    } else if (event.altKey){ // increase level
      if (level == topLevels[featureName]) return;
      oboerequest(JSON.stringify({
        queryType: 'explorative_tile_representative',
        featureName: featureName,
        level: level,
        id: id
      }));
      level++;

    } else if (event.shiftKey) { // show all cell members of this cell
      $('.highlight').removeClass('highlight');
      var representative = img.attr('data-representative');
      $("[data-representative='" + representative + "']").addClass('highlight');

    } else { // lower level
      if (level == 0) return;
      level--;
      oboerequest(JSON.stringify({
        queryType: 'explorative_tile_position',
        featureName: featureName,
        level: level,
        id: id
      }));
    }
    lastClickedId = id;
  });

  $('#btnGetExplorative').click(function(){
      featureName = $('#selectFeature').val();
      level = topLevels[featureName];
      $('#displayLevel').text(level);
      recreateContainer();
      var x = $('#container').width() / explorativeImgSize;
      var y = $('#container').height() / explorativeImgSize;
      var center = centers[featureName];
      tiler = new myTiler($('#container'), center.x - Math.floor(x/2), center.y - Math.floor(y/2), level);
  });

  $('#btnGoDirectToLevel0').click(function(){
    level = 0;
    var id = fromSearchShotId ? Shots[fromSearchShotId].videoid + '/' + fromSearchShotId : centers[featureName].id;
    oboerequest(JSON.stringify({
      queryType: 'explorative_tile_position',
      featureName: featureName,
      level: level,
      id: id
    }))
  });

  $('body').on('click', '.submitButton', function(event){
    var _this = $(this);
    // hack this works as long as the button is added after the img to the imgContainer
    var $img = _this.prev('img');
    var shotId = $img.attr('data-shotid');
    oboerequest(JSON.stringify({
      queryType: 'shot',
      shotid: shotId
    }));
    event.stopPropagation();
  });
});

function show(data){
  $('.highlight').removeClass('highlight');
  for (var i = 0; i < data.length; i++){
    var element = data[i];
    var x = element.x;
    var y = element.y;
    var representative = element.representative;
    var shotid = element.shotid;

    var img = new Image();

    setAttr(img, x, y, element.img, representative, shotid);

    if(element.img != ''){
        img.src = host + element.img + '.' + thumbnailFileType;
    }
  }
}

function setAttr(img, x, y, id, representative, shotid){
  img.onload = function() {
    var tileDiv = $('<div/>').addClass('imgContainer');
    var tile = $('<img/>').attr('src', img.src).addClass('thumb');
    tileDiv.append(tile);
    tile.attr('id', id);
    tile.attr('data-representative', representative);
    tile.attr('data-shotid', shotid);
    if (fromSearchShotId){
      if (Shots[shotid]){
        tile.css(
          {
          'border-style': 'solid',
          'border-width': '2px',
          'border-color': getColorFromScore(shotid)
          }
      );
      }
    }
    var submitButton = $('<button/>').addClass('submitButton').text('^');
    tileDiv.append(submitButton);
    tiler.show(x, y, tileDiv);
    fetched.set(x, y, tileDiv);
  };
}

function getColorFromScore(shotId){
  var scoreContainer = Scores[shotId];
  var score = 0;
  for (var key in ScoreWeights) {
    score += scoreContainer[key] * ScoreWeights[key];
  }
  return scoreToColor(score / sumWeights());
}

function recreateContainer(){
  var width = $('#container').width();
  var height = $('#container').height();
  $('#container').remove();
  var $container = $('<div>');
  $container.attr({
    'id': 'container',
    'class': 'explore'
  });
  $container.width(width).height(height);

  $('#result_pane').append($container);

}

function changeLevel(data){
  recreateContainer();
  var width = $('#container').width();
  var height = $('#container').height();
  $('#displayLevel').text(level);
  tiler = new myTiler($('#container'), data.msg.x - Math.floor(width / explorativeImgSize / 2), data.msg.y - Math.floor(height / explorativeImgSize / 2), level);

  tiler.refresh();

}

function goToExplorative(event){
  var _this = $(this);
  var shotBox = _this.parent().parent().parent();
  var shotId = parseInt(shotBox.attr('id').substring(1));
  recreateContainer();
  $('#explorebutton').click();
  fromSearchShotId = shotId;

}

function submitResultsVitrivr(){
   console.log('submitting button pressed...');
   var id = $(this).closest('.shotbox').attr('id');
   var shot = Shots[id.substring(1)];
   var data =  {start: shot.start, end: shot.end, videoId: shot.videoid};
   submitResult(data); // remove s from id
 };
