let App = (function() {

    let init = function() {
        const map = Map.show();
        Kiosks.showPosition(map)
        Attractions.update(map);
        const TransitInstance = new Transit();
        TransitInstance.update(Kiosks.getKioskID, map)
    };

    return {
        start: init
    }
   

})();

App.start();


