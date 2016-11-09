function myTiler($element, x, y, level) {

  var myX = x;
  var myY = y;
  var myLevel = level;
  fetched = new Grid();


  var tiler = new Tiler($($element), {
    x: myX, y: myY,
    tileSize: explorativeImgSize,
    margin: 2,

    fetch: function(toFetch){
      var toRequest = [];
      toFetch.forEach(function(tile) {
        var x = tile[0];
        var y = tile[1];

        if (fetched.get(x, y)) {
          return tiler.show(x, y, fetched.get(x, y));
        } else{
          toRequest.push({x: x, y: y});
        }
      });
      oboerequest(JSON.stringify(
        {
        queryType: "explorative_tiles",
        requested: toRequest,
        featureName: featureName,
        level: myLevel
      }
    ));
    }
  });

  tiler.refresh();

  var grid = tiler.grid;
  var deltaX = 0;
  var deltaY = 0;

  grid.bind('drag', function(ev, dd) {
    $($element).addClass('noClick');
    var x = deltaX + dd.deltaX;
    var y = deltaY + dd.deltaY;

    var translate = 'translate(' + x + 'px,' + y + 'px)';

    grid.css('-webkit-transform', translate);
    grid.css(   '-moz-transform', translate);
    grid.css(        'transform', translate);
  });

  grid.bind('dragend', function(ev, dd) {

    deltaX += dd.deltaX;
    deltaY += dd.deltaY;
    tiler.refresh();
  });

  $(window).resize(function() {
    tiler.refresh();
  });

  return tiler;
}
