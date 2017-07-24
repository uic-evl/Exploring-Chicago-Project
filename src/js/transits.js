let Transit = (function() {
    
    const ctaTransitToken = 'SrESNk3VtTZvrQgcU69fzZ6Uw';
    const transitDataPath = 'data/Transits.json';
    const busIconURL = 'imgs/transits/bus.png';

    const migrationColors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'];
    
    let busIcon = L.icon({
            iconUrl: busIconURL,
            iconSize: [60, 60], 
    });

    let markers = [];
    
    let init = function(kioskID, map, transit) {
        _.forEach(markers, function(marker,index){
            if(marker)
                map.removeLayer(marker);
        });

        
        _.forEach(transit, function(d, i) {
                // drawTransit(d, map);
                drawMigration(d, migrationColors[i], map);  
        });
            
    };

    let drawTransit = function(transit, map) {
        let migrationData = [];
        $.ajax({
            url:"src/php/transits.php",
            type: "post",
            dataType: 'json',
            data: {'busID':transit.name},
            success:function(data){
             _.forEach(data['bustime-response'].vehicle, function(d,i) {
                if(arePointNear({"lat": d.lat, "lng": d.lon}, {"lat":41.884122, "lng": -87.623300}, 1))
                    markers.push(L.marker([d.lat,d.lon],{icon: busIcon}).addTo(map).bindPopup(d.rt+" "+d.des +" "+d.hdg));
             });
           }
        });
    };

    let drawMigration = function(transit, migrationColor, map) {
        
        let migrationData = [];
        _.forEach(transit.stops, function(d, i) {
            if(transit.stops[i+1]!=undefined)
                migrationData.push({"from":[transit.stops[i].lon, transit.stops[i].lat],"to":[transit.stops[i+1].lon, transit.stops[i+1].lat],"labels":[null,"ETA: 3 mins"], "color": migrationColor, "name": transit.name});
        });
       
        var migrationLayer = new L.migrationLayer({
                             map: map,
                             data: migrationData,
                             pulseRadius:0,
                             text: transit.name           
        });

        migrationLayer.addTo(map);
    };

    let arePointNear = function(checkPoint, centerPoint, km) {
        var ky = 40000 / 180;
        var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
        var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
        var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
    };

    return {
        update: init
    }
})();

