let App = (function() {
  const mainMapAttribute = {
    id: "overviewMap",
    latlng: [41.883435, -87.623354],
    zoom: 13.5,
    isDetailedView: false,
    walkingDistance: 650,
    walkingDistanceLineOffset: -10
  };

  const detailedMapAttribute = {
    id: "detailedMap",
    latlng: [41.883435, -87.623354],
    zoom: 14.5,
    isDetailedView: true,
    walkingDistance: 650,
    walkingDistanceLineOffset: -23
  };

  let map;
  let detailedMap;

  let init = function() {
     map = Map.show(mainMapAttribute);
     detailedMap = Map.show(detailedMapAttribute, map);
     Kiosks.showPosition(map, detailedMap);
  };

  let getMap = function() {
    return map;
  }

  let getDetailedMap = function() {
    return detailedMap;
  }

  let update = function(time=undefined, day=undefined, isTimelapse=false) {
    let map = getMap();
    let detailedMap = getDetailedMap();
    
    // Hoposn.show(map);
    Attractions.update(map, time, day);
    Stops.update(
      Kiosks.getKioskID,
      Attractions.transitList(),
      Attractions.transitStopFilterList(),
      map,
      detailedMap
    );

    Transit.update(Kiosks.getKioskID, map, Stops.transits(), isTimelapse);

    // let updateTransit = setInterval( function()
    // {
    //     Transit.update(Kiosks.getKioskID, map, Stops.transits());

    // }, 1 * 1000);
  };
  

  return {
    start: init,
    update: update
  };

})();

App.start();
// App.update();


TimeControl.show(App);
