let Attractions = (function() {
    
    const attractionDataPath = 'data/Attractions.json';
    let transitList = new Set();
    let transitStopFilterList = new Set();


    let init = function(map) {
        $.ajax({
            type: "GET",
            url: attractionDataPath,
            dataType: "json",
            async: false,
            success: function(attractions) {
                attractions = filterAttractions(attractions);
                transitList = filterTransits(attractions);
                

                 _.forEach(attractions, function(attraction,i) {
                    let attractionIcon = L.icon({
                        iconUrl: attraction.iconUrl,
                        iconSize: attraction.iconSize,
                    });

                    L.marker(attraction.coordinates, {icon: attractionIcon}).addTo(map);
                    populateSidebar(attraction, i);

                });
            }
           
        });
    };

    let getTransitList = function() {
        return transitList;
    }

    let getTransitStopFilterList = function() { 
        return transitStopFilterList;
    }

    let filterTransits = function(data) {
        
        let transitSet = new Set();
        _.forEach(data, function(attraction, i) {
            _.forEach(attraction.cta, function(d,i){
                transitSet.add(d);
            })
        });
        return transitSet;
    };

    let filterAttractions = function(data) {
        const attractions = data.attractions.filter(function(d,i) {
            
            if(isOpenYearRound(d) || isOpenToday(d))
            {
                if(isOpenNow(d))
                   return d;
                   
                else if(d.hasOwnProperty('stops'))
                    transitStopFilterList.add(d.stops);
            }
            else if(d.hasOwnProperty('stops'))
               transitStopFilterList.add(d.stops);
        });

        cleanFilterStopList(attractions);

        return attractions;
    };

    let cleanFilterStopList = function(attractions) {
        
        let stops = attractions.map( function(d, i) {
            if(d.hasOwnProperty('stops'))
                return d.stops;
            
            return false;
        });

        stops =_.pull(_.flattenDeep(stops), false);
        transitStopFilterList =  _.flattenDeep(Array.from(transitStopFilterList));

        const intersection = _.intersectionWith(stops, transitStopFilterList, _.isEqual);
       
       _.forEach(intersection, function(d, i) {
           _.remove(transitStopFilterList, d);
       });

    };

    let isOpenNow = function(attraction) {
       if(isOpenAllHours(attraction) || isOpenAtThisHour(attraction))
            return attraction;
    };

    let isOpenAtThisHour = function(attraction) {

        return attraction.hours.start_time <= moment().format('H:mm') && attraction.hours.end_time > moment().format('H:mm');
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
                                moment(attraction.hours.end_time, 'HH:mm').format('hh:mm a') +'<br>';

        const description = listing.appendChild(document.createElement('span'));
        description.className = 'description';
        description.dataPosition = index;
        if(attraction.hasOwnProperty('description'))
            description.innerHTML = attraction.description;
    }

    return {
        update: init,
        transitList: getTransitList,
        transitStopFilterList: getTransitStopFilterList
    }

})();