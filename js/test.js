var fetched = new Grid();
// var host = 'https://s3.amazonaws.com/serge.borb.it/tiler/';
var host = '/Applications/XAMPP/xamppfiles/htdocs/vitrivr-ui/thumbnails/';

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

  // var fetched = new Grid();
  // // var host = 'https://s3.amazonaws.com/serge.borb.it/tiler/';
  // var host = '/Applications/XAMPP/xamppfiles/htdocs/vitrivr-ui/thumbnails/';
  var tiler = new Tiler($('#container'), {
    tileSize: 150,
    x: 3, y: 3,
    margin: 0,

    fetch: function(tofecth){
      tofecth.forEach(function(tile) {
        var x = tile[0];
        var y = tile[1];

        oboerequest(JSON.stringify(
          {
          queryType: "explorative_tile_single",
          x: x,
          y: y,
          featureName: 'features_averagecolor',
          level: 3
        }
      ));
    }
  )}



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

    tiler.refresh();
  });

  grid.bind('dragend', function(ev, dd) {
    deltaX += dd.deltaX;
    deltaY += dd.deltaY;
  });

  $(window).resize(function() {
    tiler.refresh();
  });
});

function show(data){
  if (fetched.get(x, y)) {
    return tiler.show(x, y, fetched.get(x, y));
  }

  var img = new Image();

  img.onload = function() {
    var tile = $('<img/>').attr('src', img.src);

    tiler.show(x, y, tile);
    fetched.set(x, y, tile);
  };

  img.src = host + data[0] + '.jpg';
}
