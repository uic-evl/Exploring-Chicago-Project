let Attractions = (function() {
    
    const attractionDataPath = 'data/Attractions.json';

    let init = function(map) {
    
        d3.json(attractionDataPath, function(attractions){
            attractions = filterAttractions(attractions);
            
            _.forEach(attractions, function(d,i){
                let attractionIcon = L.icon({
                    iconUrl: d.iconUrl,
                    iconSize: d.iconSize,
                });

                L.marker(d.coordinates, {icon: attractionIcon}).addTo(map);

            });

        });
    };

    let filterAttractions = function(data) {
        const attractions = data.attractions.filter(function(d,i) {
            if(isOpenYearRound(d) || isOpenToday(d))
                if(isOpenNow(d))
                    return d;
        });

        return attractions;
    };

    let isOpenNow = function(attraction) {
       if(isOpenAllHours(attraction) || isOpenAtThisHour(attraction))
            return attraction;
    };

    let isOpenAtThisHour = function(attraction) {
        return attraction.hours.start_time < moment().format('H') && attraction.hours.end_time > moment().format('H');
    };

    let isOpenAllHours = function(attraction) {
         return !attraction.hasOwnProperty('hours');
    };

    let isOpenToday = function(attraction) {
        let open = false;
        _.forEach(attraction.days, function(d,i){ 
            if(d.toLowerCase() == (moment().format('dddd')).toLowerCase()) 
                  open = true;
        });
        return open;
    };

    let isOpenYearRound = function(attraction) {
        return !attraction.hasOwnProperty('days');
    };

    return {
        update: init
    }

})();