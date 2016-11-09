var tiler = undefined;
var host = 'http://localhost/vitrivr-ui/thumbnails/';
var level = 6;
var featureName = '';
$(document).ready(function(){
  $('body').on('click', 'img', function(){
    if($('#container').hasClass('noClick')){
      $('#container').removeClass('noClick');
      return;
    }
    if(level == 0) return;
    var img = $(this);
    var src = img.attr('src');
    var id = src.replace(host, '').replace('.jpg', '');
    level = level - 1;
    oboerequest(JSON.stringify({
      queryType: 'explorative_tile_position',
      featureName: featureName,
      level: level,
      id: id
    }));
  });

  $('#btnGetExplorative').click(function(){
      featureName = $('#selectFeature').val();
      level = topLevels[featureName];
      console.log(level);
      recreateContainer();
      var x = $('#container').width() / explorativeImgSize;
      var y = $('#container').height() / explorativeImgSize;
      tiler = new myTiler($('#container'), 1 - Math.floor(x/2), 1 - Math.floor(y/2), level);
  });


});

function show(data){
  for (var i = 0; i < data.length; i++){
    var element = data[i];
    var x = element.x;
    var y = element.y;

    var img = new Image();

    setSrc(img, x, y);

    if(element.img != ''){
        img.src = host + element.img + '.' + thumbnailFileType;
    }
  }
}

function setSrc(img, x, y){
  img.onload = function() {
    var tile = $('<img/>').attr('src', img.src).addClass('thumb');

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
  tiler = new myTiler($('#container'), data.msg.x - Math.floor(width / explorativeImgSize / 2), data.msg.y - Math.floor(height / explorativeImgSize / 2), level);

  tiler.refresh();
}
