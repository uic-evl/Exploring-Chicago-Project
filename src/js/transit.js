let Transit = function() {
    
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
                 let pulsingIcon = L.icon.pulse({iconSize:[10, 10],color:"blue"});
                 let marker = L.marker([d.lat,d.lon],{icon: busIcon}).addTo(map);
             });
           }
         });
      
    };

    return {
        update: init
    }
};