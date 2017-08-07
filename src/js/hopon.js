let Hopon = (function() {

    const hoponDataPath = 'data/Hopon.json';
    const thingsPath = 'data/test.json';

    let init = function(map) {

        let waypoints = [];

        $.ajax({
            type: "GET",
            url: hoponDataPath,
            dataType: "json",
            async: false,
            success: function(hoponData) {
               _.forEach(hoponData.Hopon[0].routes, function(d,i){
                    waypoints.push(L.latLng(d.lat,d.lon));
               })
                
            }
        });

        L.Routing.control({
            waypoints: waypoints,
            fitSelectedRoutes: false
        }).addTo(map);
   

    };

    return {
        show: init
    }

})();
