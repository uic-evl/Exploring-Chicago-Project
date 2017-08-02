let App = (function() {

    const mainMapAttribute = {
        "id": "overviewMap",
        "latlng":[41.883435, -87.623354],
        "zoom": 13.5,
        "isDetailedView": false,
        "walkingDistance": 650,
        "walkingDistanceLineOffset": -10
    };

    const detailedMapAttribute = {
        "id": "detailedMap",
        "latlng":[41.883435, -87.623354],
        "zoom": 14.5,
        "isDetailedView": true,
        "walkingDistance": 650,
        "walkingDistanceLineOffset": -23
    };

    let init = function() {
        const map = Map.show(mainMapAttribute);
        const detailedMap = Map.show(detailedMapAttribute, map);
        Kiosks.showPosition(map, detailedMap);
         Hopon.show(map);
        Attractions.update(map);
        Stops.update(Kiosks.getKioskID, Attractions.transitList(), Attractions.transitStopFilterList(), map, detailedMap);
        Transit.update(Kiosks.getKioskID, map, Stops.transits());
       

        
        // let updateTransit = setInterval( function() 
        // {
        //     Transit.update(Kiosks.getKioskID, map);

        // }, 10 * 1000);
       
    };

    return {
        start: init
    }
   

})();

App.start();


