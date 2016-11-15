var tiler = undefined;
var host = 'http://localhost/vitrivr-ui/thumbnails/';
var level = undefined;
var featureName = '';
var lastClickedId = '';

$(document).ready(function(){
  $('body').on('click', 'img', function(event){
    if($('#container').hasClass('noClick')){
      $('#container').removeClass('noClick');
      return;
    }
    var img = $(this);
    var src = img.attr('src');
    var id = src.replace(host, '').replace('.jpg', '');
    if (event.altKey){
      if (level == topLevels[featureName]) return;
      oboerequest(JSON.stringify({
        queryType: 'explorative_tile_representative',
        featureName: featureName,
        level: level,
        id: id
      }));
      level++;
    } else if (event.shiftKey) {
      $('.highlight').removeClass('highlight');
      var representative = img.attr('data-representative');
      $("[data-representative='" + representative + "']").addClass('highlight');
    } else {
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


});

function show(data){
  $('.highlight').removeClass('highlight');
  for (var i = 0; i < data.length; i++){
    var element = data[i];
    var x = element.x;
    var y = element.y;
    var representative = element.representative;

    var img = new Image();

    setSrc(img, x, y, element.img, representative);

    if(element.img != ''){
        img.src = host + element.img + '.' + thumbnailFileType;
    }
  }
}

function setSrc(img, x, y, id, representative){
  img.onload = function() {
    var tile = $('<img/>').attr('src', img.src).addClass('thumb');
    tile.attr('id', id);
    tile.attr('data-representative', representative);
    tiler.show(x, y, tile);
    fetched.set(x, y, tile);
  };
}

function recreateContainer(){
  var width = $('#container').width();
  var height = $('#container').height();
  $('#container').remove();
  var $container = $('<div>');
  $container.attr('id', 'container');
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
