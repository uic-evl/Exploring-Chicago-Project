var App = (function() {

    mapboxgl.accessToken = 'pk.eyJ1IjoibXRob21hNTIiLCJhIjoiY2lmOXNja3Y0MWZwenNra241NXNyejRybyJ9.R6CQ-cSJaEa2Ziu1iS7cAQ';

    var initMap = function() {
        const container = 'map';
        const style = 'mapbox://styles/mapbox/light-v9';
        const center = [-87.636920, 41.882386];
        const zoom = 12.9;
        const interactive = true;

        return new mapboxgl.Map({
        container: container,
        style: style,
        center: center,
        zoom: zoom,
        interactive: interactive
        });
    };

    var initAttractions = function(map) {
        const attractionDataPath = 'data/Attractions.json'
        map.on('load', () => {
            d3.json(attractionDataPath, function(data) {
                _.each(data.attractions, function(d,i) {
                    console.log(d)
                        map.loadImage(d.iconURL, (error, image) => {
                        if (error) throw error;
                        map.addImage(d.name, image);
                        map.addLayer({
                            "id": "points",
                            "type": "symbol",
                            "source": {
                                "type": "geojson",
                                "data": {
                                    "type": "FeatureCollection",
                                    "features": [{
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": d.coordinates
                                        }
                                    }]
                                }
                            },
                            "layout": {
                                "icon-image": d.name,
                                "icon-size": d.iconSize
                            }
                        });
                    });
                })
            })
        });

    };

    return {
        showMap: initMap,
        updateAttractions: initAttractions
    }
})();

const map = App.showMap();
App.updateAttractions(map);

