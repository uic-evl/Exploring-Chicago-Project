let App = (function() {

    let init = function() {
        const map = Map.show();
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


