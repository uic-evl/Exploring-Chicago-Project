let Stops = (function() {

    let run = 'production' //let run = 'developement/production'

    const transitDataPath = 'data/Transits.json';
    const stopIconURL = 'imgs/transits/busStop3.png'
    
    let stopIconWithOptions = L.Icon.extend({
        options: {
            iconAnchor: [7, 5]
        }
    });

    let stopIcon = new stopIconWithOptions({
        iconUrl: stopIconURL,
        iconSize: [12.6, 15.3], 
    });


    let init = function(kioskID, map) {



                var data = [{"from":[-87.623636841381, 41.884289988942],"to":[-87.639575600624, 41.876974562066],"labels":[null,"ETA: 3 mins"],"color":"#ff3a31"},
                            {"from":[-87.627909064031, 41.883487234033],"to":[-87.627725601196, 41.878320605984],"labels":[null,null],"color":"#31a354"},
                            {"from":[-87.627725601196, 41.878320605984],"to":[-87.615827322006, 41.864782986081],"labels":[null,null],"color":"#31a354"},
                            {"from":[-87.615827322006, 41.864782986081],"to":[-87.612978816032, 41.866085342666],"labels":[null,null],"color":"#31a354"}];

        var migrationLayer = new L.migrationLayer({
                             map: map,
                             data: data,

                    
        });
        migrationLayer.addTo(map);

        d3.json(transitDataPath, function(data) {
            _.forEach(data.Transits, function(d, i) {
                drawStops(d, map);
            });
        });

    };

    let drawStops = function(transit, map) {

        if(run == 'production') {
            _.forEach(transit.stops, function(stop, i) {
                let pulsingIcon = L.icon.pulse({iconSize:[10,10], color:"blue"});
                L.marker([stop.lat,stop.lon],{icon: stopIcon}).addTo(map).bindPopup('lat:'+stop.lat + "," + stop.lon);             
            });
        }
        else {

            $.ajax({
                url:"src/php/stops.php",
                type: "post",
                dataType: 'json',
                data: {
                    'busID': transit.name, 
                    'busDir': transit.dir
                    },
                success:function(data){
                    _.forEach(data['bustime-response'].stops, function(stops,i) {
                        let pulsingIcon = L.icon.pulse({iconSize:[10,10], color:d3.scale.category20()});
                        L.marker([stops.lat,stops.lon],{icon: stopIcon}).addTo(map).bindPopup('lat:'+stops.lat + "," + stops.lon);  
                    });
                }
            });
        }
      
    };

    return {
        update: init
    }

})();
    