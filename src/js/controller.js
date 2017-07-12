let App = (function() {

    let init = function() {
        const map = Map.show();
        Kiosks.showPosition(map)
        Attractions.update(map);
        
        Transit.update(Kiosks.getKioskID, map)  
    };

    return {
        start: init
    }
   

})();

App.start();


