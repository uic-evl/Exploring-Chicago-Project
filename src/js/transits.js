let Transit = (function() {
  const ctaTransitToken = "SrESNk3VtTZvrQgcU69fzZ6Uw";
  const transitDataPath = "data/Transits.json";
  const busIconURL = "imgs/transits/bus.png";
  
  let migrationLayer;
  let migrationLayers= [];
  let isMigrationLayerSet = false;

  const migrationColors = {
    bus: "#dd3497",
    blue: "#3182bd",
    red: "#de2d26",
    orange: "#feb24c"
  };

  let busIcon = L.icon({
    iconUrl: busIconURL,
    iconSize: [60, 60]
  });

  let markers = [];

  let init = function(kioskID, map, transit, isDetailedView = undefined) {

    if(migrationLayers)
      _.forEach(migrationLayers, function(d,i) {
        if(d.container.parentNode != null)
          d.destroy();
      })

    _.forEach(transit, function(d, i) {
      // drawTransit(d, map);
      drawMigration(d, map, isDetailedView);
    });
  };

  let drawTransit = function(transit, map) {
    let migrationData = [];
    let marker
    $.ajax({
      url: "src/php/transits.php",
      type: "post",
      dataType: "json",
      data: { busID: transit.name },
      success: function(data) {
        _.forEach(data["bustime-response"].vehicle, function(d, i) {
          if (arePointNear({ lat: d.lat, lng: d.lon }, { lat: 41.884122, lng: -87.6233 }, 1))
          {
            marker = L.marker([d.lat, d.lon], { icon: busIcon });
            markers.push(marker);
            marker.addTo(map).bindPopup(d.rt + " " + d.des + " " + d.hdg)
          }  
        });
      }
    });
  };

  let drawMigration = function(transit, map, isDetailedView) {
    let migrationData = [];
  
    let color = migrationColors.bus;

    const transitName = transit.name;

    let eta = undefined;

    if (transit.type == "Train") {
      color = migrationColors[transitName];
    }

    _.forEach(transit.stops, function(d, i) {
      if (transit.stops[i + 1] != undefined) {
          // if(!isDetailedView)
          //   eta = getETA(transit.stops[i], transit.stops[i + 1], transitName);

        migrationData.push({
          from: [transit.stops[i].lon, transit.stops[i].lat],
          to: [transit.stops[i + 1].lon, transit.stops[i + 1].lat],
          labels: [null, null],
          color: color,
          name: transit.name,
          eta: eta
        });
      }
    });

    setMigrationLayer(migrationData,map,transit);

    if (isDetailedView) {
      setInterval(function() {
        migrationLayer.setData(migrationData);
      }, 7000);
    }
  };

  let setMigrationLayer = function(migrationData, map, transit) {
     
      migrationLayer = new L.migrationLayer({
        map: map,
        data: migrationData,
        pulseRadius: 0,
        text: transit.name
      });
      
      migrationLayers.push(migrationLayer);
      migrationLayer.addTo(map);
  };

  let getETA = function(origin, destintaion, transitName) {
    let eta = undefined;
    $.ajax({
      url: "src/php/eta.php",
      type: "post",
      dataType: "json",
      async: false,
      data: {
        orginLat: origin.lat,
        orginLng: origin.lon,
        destinationLat: destintaion.lat,
        destinationLng: destintaion.lon
      },
      success: function(data) {
        _.forEach(data, function(d, i) {
          _.forEach(d, function(d) {
            if (d.hasOwnProperty("legs"))
              _.forEach(d.legs[0].steps, function(d, i) {
                if (d.transit_details != undefined)
                  if (d.transit_details.line.short_name == transitName)
                      eta = moment.unix(d.transit_details.arrival_time.value - d.transit_details.departure_time.value).format('m');
              });
          });
        });
      }
    });

    return eta;
  };

  return {
    update: init
  };
})();
