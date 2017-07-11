let Transit = (function() {
    
    const ctaTransitToken = 'SrESNk3VtTZvrQgcU69fzZ6Uw';

    let init = function(kioskID, map) {
        const transitDataPath = 'data/Transits.json';
        const busIconURL = 'imgs/transits/bus.png'
        var busIcon = L.icon({
            iconUrl: busIconURL,
            iconSize: [60, 60], 
        });
    
        $.ajax({
            url:"src/php/transit.php",
            type: "post",
            dataType: 'json',
            data: {'busID':60},
            success:function(data){

             _.forEach(data['bustime-response'].vehicle, function(d,i) {
                 if(arePointNear({"lat": d.lat, "lng": d.lon}, {"lat":41.884122, "lng": -87.623300}, 1))
                    L.marker([d.lat,d.lon],{icon: busIcon}).addTo(map);
             });
           }
         });
      
    };

    let arePointNear = function(checkPoint, centerPoint, km) {
        var ky = 40000 / 360;
        var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
        var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
        var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
    }

    return {
        update: init
    }
})();