let Map = (function() {

    const accessToken = 'pk.eyJ1IjoibXRob21hNTIiLCJhIjoiY2lmOXNja3Y0MWZwenNra241NXNyejRybyJ9.R6CQ-cSJaEa2Ziu1iS7cAQ';
    const mapID = 'mapbox.light';
    
    let tileURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+accessToken;

    let init = function(attributes) {

       let title = 'Overview'; 



       let map = L.map(attributes.id,{ closePopupOnClick: false}).setView(attributes.latlng, attributes.zoom);
       
       let walkingDistanceLine = L.circle(attributes.latlng, attributes.walkingDistance).setStyle({
                                fill:true,
                                fillColor: '#de2d26',
                                fillOpacity: 0.1,
                                stroke: false
                             });

       let border = L.rectangle(map.getBounds())
                        .setStyle({
                            fill: false,
                            stroke: true,
                            color: '#756bb1',
                            weight: 8
                        });


       if(attributes.isDetailedView)
        {
            title = 'Local View';
            border.addTo(map);
            
            tileURL = 'https://api.mapbox.com/styles/v1/mthoma52/cj5mrnmkp3p292rmthozjux8g/tiles/256/{z}/{x}/{y}?access_token='+accessToken;

        }

       

       map.zoomControl.remove();
       map.dragging.disable();
       map.touchZoom.disable();
       map.doubleClickZoom.disable();
       map.scrollWheelZoom.disable(); 
       
       plotWalkingDistance(map, attributes.latlng, attributes.walkingDistance, attributes.walkingDistanceLineOffset);
       walkingDistanceLine.addTo(map);
       
       L.tileLayer(tileURL, {
            id: mapID,
       }).addTo(map);

       return map;
    };

    let plotWalkingDistance = function(map, startPoint, walkingDistance, walkingDistanceLineOffset) {
            
        const R = 6378.1;
        const brng = 1.57;

        let length = walkingDistance/ 1000;

        lat1 = toRadian(startPoint[0]);
        lon1 = toRadian(startPoint[1]);

        lat2 = Math.asin(Math.sin(lat1) * Math.cos(length/R) +
                Math.cos(lat1) * Math.sin(length/R) * Math.cos(brng)); 

        lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(length/R) * Math.cos(lat1),
                Math.cos(length/R) - Math.sin(lat1)*Math.sin(lat2));

        lat2 = toDegrees(lat2)
        lon2 = toDegrees(lon2)

        let line = L.polyline([[41.882657, -87.623304], [lat2, lon2]], {
                        color: '#de2d26',
                        weight: 3,
                        opacity: .7,
                        dashArray: '5,15',
                        lineJoin: 'round'
                    });

        line.setOffset(walkingDistanceLineOffset);
        line.addTo(map);

    };

    let toDegrees = function(angle) {
        return angle * (180 / Math.PI);
    };

    let toRadian  = function(angle) {
        return angle * (Math.PI / 180);
    };

    return {
        show: init
    }
})();


