var tiler = undefined;
var host = 'http://localhost/vitrivr-ui/thumbnails/';
var level = 3;
var featureName = 'features_averagecolor';
$(document).ready(function(){

  $(document).on('click', 'img', function(){
    if($('#container').hasClass('noClick')){
      $('#container').removeClass('noClick');
      return;
    }
    console.log('click');
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
  // tiler = new Tiler($('#container'), {
  //   tileSize: 150,
  //   x: 1, y: 1,
  //   margin: 2,
  //
  //   fetch: function(tofecth){
  //     tofecth.forEach(function(tile) {
  //       var x = tile[0];
  //       var y = tile[1];
  //
  //       if (fetched.get(x, y)) {
  //         return tiler.show(x, y, fetched.get(x, y));
  //       }
  //
  //       oboerequest(JSON.stringify(
  //         {
  //         queryType: "explorative_tile_single",
  //         x: x,
  //         y: y,
  //         featureName: featureName,
  //         level: level
  //       }
  //     ));
  //     })
  //   }
  // });
  //
  // tiler.refresh();
  //
  // var grid = tiler.grid;
  // var deltaX = 0;
  // var deltaY = 0;
  //
  // grid.bind('drag', function(ev, dd) {
  //   $('#container').addClass('noClick');
  //   var x = deltaX + dd.deltaX;
  //   var y = deltaY + dd.deltaY;
  //
  //   var translate = 'translate(' + x + 'px,' + y + 'px)';
  //
  //   grid.css('-webkit-transform', translate);
  //   grid.css(   '-moz-transform', translate);
  //   grid.css(        'transform', translate);
  //
  //   // tiler.refresh();
  // });
  //
  // grid.bind('dragend', function(ev, dd) {
  //
  //   deltaX += dd.deltaX;
  //   deltaY += dd.deltaY;
  //   tiler.refresh();
  // });
  //
  // $(window).resize(function() {
  //   tiler.refresh();
  // });
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

  // tiler = new Tiler($('#container'), {
  //   tileSize: 150,
  //   x: data.msg.x, y: data.msg.y,
  //   margin: 2,
  //
  //   fetch: function(tofecth){
  //     tofecth.forEach(function(tile) {
  //       var x = tile[0];
  //       var y = tile[1];
  //
  //       if (fetched.get(x, y)) {
  //         return tiler.show(x, y, fetched.get(x, y));
  //       }
  //
  //       oboerequest(JSON.stringify(
  //         {
  //         queryType: "explorative_tile_single",
  //         x: x,
  //         y: y,
  //         featureName: featureName,
  //         level: 2
  //       }
  //     ));
  //     })
  //   }
  // });
  // fetched = new Grid();
  // tiler.refresh();
  //
  // var grid = tiler.grid;
  // var deltaX = 0;
  // var deltaY = 0;
  //
  // grid.bind('drag', function(ev, dd) {
  //   $('#container').addClass('noClick');
  //   var x = deltaX + dd.deltaX;
  //   var y = deltaY + dd.deltaY;
  //
  //   var translate = 'translate(' + x + 'px,' + y + 'px)';
  //
  //   grid.css('-webkit-transform', translate);
  //   grid.css(   '-moz-transform', translate);
  //   grid.css(        'transform', translate);
  //
  //   // tiler.refresh();
  // });
  //
  // grid.bind('dragend', function(ev, dd) {
  //   deltaX += dd.deltaX;
  //   deltaY += dd.deltaY;
  //   tiler.refresh();
  // });
}
