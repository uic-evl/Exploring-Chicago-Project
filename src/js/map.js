let Map = (function() {

    const accessToken = 'pk.eyJ1IjoibXRob21hNTIiLCJhIjoiY2lmOXNja3Y0MWZwenNra241NXNyejRybyJ9.R6CQ-cSJaEa2Ziu1iS7cAQ';
    const tileURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+accessToken;
    const mapID = 'mapbox.light';

    let init = function() {
       let map = L.map('map').setView([41.882386, -87.636920], 13.5);
       
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


