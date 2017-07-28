let Map = (function() {

    const accessToken = 'pk.eyJ1IjoibXRob21hNTIiLCJhIjoiY2lmOXNja3Y0MWZwenNra241NXNyejRybyJ9.R6CQ-cSJaEa2Ziu1iS7cAQ';
    const mapID = 'mapbox.light';
    
    let tileURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+accessToken;

    let init = function(attributes) {
       let map = L.map(attributes.id,{ closePopupOnClick: false}).setView(attributes.latlng, attributes.zoom);
       let rectangle = L.rectangle(map.getBounds());

       let title = 'Overview'; 

       if(attributes.isDetailedView)
        {
            title = 'Local View'
            rectangle.addTo(map);
            
            tileURL = 'https://api.mapbox.com/styles/v1/mthoma52/cj5mrnmkp3p292rmthozjux8g/tiles/256/{z}/{x}/{y}?access_token='+accessToken;

        }

       map.zoomControl.remove();
       map.dragging.disable();
       map.touchZoom.disable();
       map.doubleClickZoom.disable();
       map.scrollWheelZoom.disable(); 
       
       L.tileLayer(tileURL, {
            id: mapID,
       }).addTo(map);

       return map;
    };

    return {
        show: init
    }
})();


