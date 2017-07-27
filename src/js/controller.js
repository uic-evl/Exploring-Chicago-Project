let App = (function() {

    const mainMapAttribute = {
        "id": "map",
        "latlng":[41.882657, -87.623304],
        "zoom": 13.5,
        "isDetailedView": false
    };

    const detailedMapAttribute = {
        "id": "detailedMap",
        "latlng":[41.882822, -87.627926],
        "zoom": 14.5,
        "isDetailedView": true
    };

    let init = function() {
        const map = Map.show(mainMapAttribute);
        const detailedMap = Map.show(detailedMapAttribute);
        Kiosks.showPosition(map);
        Attractions.update(map);
        Stops.update(Kiosks.getKioskID, map, Attractions.transitList(), Attractions.transitStopFilterList());
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


