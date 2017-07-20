let Stops = (function() {

    let run = 'production' //let run = 'developement/production';
    let transits = [];

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


    let init = function(kioskID, map, transitList, transitStopFilterList) {
        
        transitList = Array.from(transitList);
        transitStopFilterList = [].concat.apply([],Array.from(transitStopFilterList));

        filterStops(map, transitList, transitStopFilterList);
       
    };

    let getTransit = function() {
        return transits;
    };

    let filterStops = function(map, transitList, transitStopFilterList) {
         $.ajax({
            type: "GET",
            url: transitDataPath,
            dataType: "json",
            async: false,
            success: function(transitCollection) {
                transits = [];
                _.forEach(transitCollection.Transits, function(data, i) {
                   
                    if(_.includes(transitList, data.name)) {
                        _.forEach(data.stops, function(stop, j) {
                            _.forEach(transitStopFilterList, function(d, k) {
                                if((stop!=undefined && stop.lat === d.lat && stop.lon === d.lon))
                                     data.stops.splice(j, 1);
                            })
                        });

                        if(data.stops.length > 1)
                            transits.push(data);
                    }
                });
                
                drawStops(transits, map);
            }
        });
    };

    let drawStops = function(transits, map) {
        if(run == 'production') {
            _.forEach(transits, function(transit, i) {
                _.forEach(transit.stops, function(stop, i) {
                    let pulsingIcon = L.icon.pulse({iconSize:[10,10], color:"blue"});
                    L.marker([stop.lat,stop.lon],{icon: stopIcon}).addTo(map).bindPopup('lat:'+stop.lat + "," + stop.lon); 
                });       
            });
        }
        else {
            _.forEach(transits, function(transit, i) {
                $.ajax({
                    url:"src/php/stops.php",
                    type: "post",
                    dataType: 'json',
                    data: {
                        'busID': transit.name, 
                        'busDir': transit.dir
                        },
                    success:function(data){
                        console.log(data);
                        _.forEach(data['bustime-response'].stops, function(stops,i) {
                            let pulsingIcon = L.icon.pulse({iconSize:[10,10], color:d3.scale.category20()});
                            L.marker([stops.lat,stops.lon],{icon: stopIcon}).addTo(map).bindPopup('lat:'+stops.lat + "," + stops.lon);  
                        });
                    }
                });
            });
        }
      
    };

    return {
        update: init,
        transits: getTransit
    }

})();
    