let App = (function() {

    let init = function() {
        const map = Map.show();
        Kiosks.showPosition(map)
        Attractions.update(map);
        console.log(Attractions.showTransitList());
        Transit.update(Kiosks.getKioskID, map);
        Stops.update(Kiosks.getKioskID, map);
        
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


