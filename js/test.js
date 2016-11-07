var tiler = undefined;
var host = 'http://localhost/vitrivr-ui/thumbnails/';
var level = 6;
var featureName = 'features_averagecolorgrid8';
$(document).ready(function(){

  $(document).on('click', 'img', function(){
    if($('#container').hasClass('noClick')){
      $('#container').removeClass('noClick');
      return;
    }
    if(level == 1) return;
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

  tiler = new myTiler($('#container'), 1, 1, level);
});

function show(data){
  var x = data.x;
  var y = data.y;

  var img = new Image();

  img.onload = function() {
    var tile = $('<img/>').attr('src', img.src).addClass('thumb');

    tiler.show(x, y, tile);
    fetched.set(x, y, tile);
  };
  if(data.msg[0] != ''){
      img.src = host + data.msg[0] + '.jpg';
  } else{
      img.src = host + '1/65537.jpg';
  }
}

function changeLevel(data){
  $('#container').remove();
  var $container = $('<div>');
  $container.attr('id', 'container');
  $container.width(600).height(600);

  $('body').html($container);

  tiler = new myTiler($('#container'), data.msg.x, data.msg.y, level);

  tiler.refresh();
}
