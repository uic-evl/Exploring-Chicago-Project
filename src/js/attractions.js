let Attractions = (function() {
    
    const attractionDataPath = 'data/Attractions.json';

    let init = function(map) {
    
        d3.json(attractionDataPath, function(attractions) {
            attractions = filterAttractions(attractions);
            
            _.forEach(attractions, function(attraction,i) {
                let attractionIcon = L.icon({
                    iconUrl: attraction.iconUrl,
                    iconSize: attraction.iconSize,
                });

                L.marker(attraction.coordinates, {icon: attractionIcon}).addTo(map);
                populateSidebar(attraction, i)

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

    let populateSidebar = function(attraction, index) {
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.id = 'listing-' + index;

        const icon = listing.appendChild(document.createElement('img'));
        icon.className = 'icon';
        icon.style = 'width:'+attraction.iconSize[0] + 'px;height:' +
                              attraction.iconSize[1] + 'px;float:left; margin-right:10px;';
        icon.dataPosition = index;
        icon.src = attraction.iconUrl;

        const title = listing.appendChild(document.createElement('h2'));
        title.className = 'title';
        title.dataPosition = index;
        title.innerHTML = attraction.name;
        
        const hours = listing.appendChild(document.createElement('span'));
        hours.className = 'hours';
        hours.dataPosition = index;
        if(attraction.hasOwnProperty('hours'))
            hours.innerHTML = "Open Hours: " +
                               moment(attraction.hours.start_time, 'HH:mm').format('hh:mm a') + 
                               " - " +
                                moment(attraction.hours.end_time, 'HH:mm').format('hh:mm a');
    }

    return {
        update: init
    }

})();