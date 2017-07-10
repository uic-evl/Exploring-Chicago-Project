var App = (function() {

    const accessToken = 'pk.eyJ1IjoibXRob21hNTIiLCJhIjoiY2lmOXNja3Y0MWZwenNra241NXNyejRybyJ9.R6CQ-cSJaEa2Ziu1iS7cAQ';
    const tileURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+accessToken;
    const mapID = 'mapbox.light';

    var initMap = function() {
       var map = L.map('map').setView([41.882386, -87.636920], 13.5);
       
       map.zoomControl.remove();
       map.dragging.disable();
       map.touchZoom.disable();
       map.doubleClickZoom.disable();
       map.scrollWheelZoom.disable(); 
       
       L.tileLayer(tileURL, {
            id: mapID,
       }).addTo(map);

   

       return map;
    }

    var initAttractions = function(map) {
        
        const attractionDataPath = 'data/Attractions.json';

        d3.json(attractionDataPath, function(data){
            console.log(data);
            _.forEach(data.attractions, function(d,i){
                var attractionIcon = L.icon({
                    iconUrl: d.iconUrl,
                    iconSize: d.iconSize,
                });

                L.marker(d.coordinates, {icon: attractionIcon}).addTo(map);

            });

        });
    };

    var initKioskPosition = function(map) {
      
      const iconSize = [10, 10];
      const color = '#de2d26';
      const  latlng = [41.884122, -87.623300];

      
      var pulsingIcon = L.icon.pulse({iconSize:iconSize,color:color});
      var marker = L.marker(latlng,{icon: pulsingIcon}).addTo(map);
    }

    return {
        showMap: initMap,
        updateAttractions: initAttractions,
        showPosition: initKioskPosition
    }
})();


