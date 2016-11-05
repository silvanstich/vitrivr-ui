var fetched = new Grid();
var tiler = undefined;
var host = '/vitrivr-ui/thumbnails/';

$(document).ready(function(){

  // $(document).on('keyup', function(){
  //   var query = {
  //   	queryType: "explorative_tile_single",
  //     startX: 0,
  //     startY: 0,
  //     endX: 100,
  //     endY: 100,
  //     featureName: 'features_averagecolor',
  //     level: 3,
  //     id: '14/917532'
  //   };
  //   oboerequest(JSON.stringify(query));
  // });

  tiler = new Tiler($('#container'), {
    tileSize: 150,
    x: 1, y: 1,
    margin: 2,

    fetch: function(tofecth){
      tofecth.forEach(function(tile) {
        var x = tile[0];
        var y = tile[1];

        if (fetched.get(x, y)) {
          return tiler.show(x, y, fetched.get(x, y));
        }

        oboerequest(JSON.stringify(
          {
          queryType: "explorative_tile_single",
          x: x,
          y: y,
          featureName: 'features_averagecolor',
          level: 3
        }
      ));
      })
    }
  });

  tiler.refresh();

  var grid = tiler.grid;
  var deltaX = 0;
  var deltaY = 0;

  grid.bind('drag', function(ev, dd) {
    var x = deltaX + dd.deltaX;
    var y = deltaY + dd.deltaY;

    var translate = 'translate(' + x + 'px,' + y + 'px)';

    grid.css('-webkit-transform', translate);
    grid.css(   '-moz-transform', translate);
    grid.css(        'transform', translate);

    // tiler.refresh();
  });

  grid.bind('dragend', function(ev, dd) {
    deltaX += dd.deltaX;
    deltaY += dd.deltaY;
    tiler.refresh();
  });

  $(window).resize(function() {
    tiler.refresh();
  });
});

function show(data){
  var x = data.x;
  var y = data.y;
  // if (fetched.get(x, y)) {
  //   return tiler.show(x, y, fetched.get(x, y));
  // }

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
