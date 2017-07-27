let Map = (function() {

    const accessToken = 'pk.eyJ1IjoibXRob21hNTIiLCJhIjoiY2lmOXNja3Y0MWZwenNra241NXNyejRybyJ9.R6CQ-cSJaEa2Ziu1iS7cAQ';
    const tileURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+accessToken;
    const mapID = 'mapbox.light';

    let init = function(attributes) {
       let map = L.map(attributes.id).setView(attributes.latlng, attributes.zoom);
       let rectangle = L.rectangle(map.getBounds());
       
       if(attributes.isDetailedView)
        rectangle.addTo(map);
       
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

    return {
        show: init
    }
})();


