let Transit = (function() {
    
    const ctaTransitToken = 'SrESNk3VtTZvrQgcU69fzZ6Uw';
    const transitDataPath = 'data/Transits.json';
    const busIconURL = 'imgs/transits/bus.png'
    
    let busIcon = L.icon({
            iconUrl: busIconURL,
            iconSize: [60, 60], 
    });
    let markers = [];
    
    let init = function(kioskID, map) {

        _.forEach(markers, function(marker,index){
            if(marker)
                map.removeLayer(marker);
        });

        d3.json(transitDataPath, function(data) {
            _.forEach(data.Transits, function(d, i) {
                drawTransit(d, map);
            });
        });      
    };

    let drawTransit = function(transit, map) {
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


    }

    let arePointNear = function(checkPoint, centerPoint, km) {
        var ky = 40000 / 180;
        var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
        var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
        var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
    }

    return {
        update: init
    }
})();