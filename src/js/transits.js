let Transit = (function() {
  const ctaTransitToken = "SrESNk3VtTZvrQgcU69fzZ6Uw";
  const transitDataPath = "data/Transits.json";
  const busIconURL = "imgs/transits/bus.png";

  const migrationColors = {
    bus: "#636363",
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
    _.forEach(markers, function(marker, index) {
      if (marker) map.removeLayer(marker);
    });

    _.forEach(transit, function(d, i) {
      // drawTransit(d, map);
      drawMigration(d, map, isDetailedView);
    });
  };

  let drawTransit = function(transit, map) {
    let migrationData = [];
    $.ajax({
      url: "src/php/transits.php",
      type: "post",
      dataType: "json",
      data: { busID: transit.name },
      success: function(data) {
        _.forEach(data["bustime-response"].vehicle, function(d, i) {
          if (
            arePointNear(
              { lat: d.lat, lng: d.lon },
              { lat: 41.884122, lng: -87.6233 },
              1
            )
          )
            markers.push(
              L.marker([d.lat, d.lon], { icon: busIcon })
                .addTo(map)
                .bindPopup(d.rt + " " + d.des + " " + d.hdg)
            );
        });
      }
    });
  };

  let drawMigration = function(transit, map, isDetailedView) {
    let migrationData = [];

    let color = migrationColors.bus;

    const transitName = transit.name;

    if (transit.type == "Train") {
      color = migrationColors[transitName];
    }

    _.forEach(transit.stops, function(d, i) {
      if (transit.stops[i + 1] != undefined) {
          if(!isDetailedView)
            getETA(transit.stops[i], transit.stops[i + 1], transitName);
        migrationData.push({
          from: [transit.stops[i].lon, transit.stops[i].lat],
          to: [transit.stops[i + 1].lon, transit.stops[i + 1].lat],
          labels: [null, null],
          color: color,
          name: transit.name
        });
      }
    });

    let migrationLayer = new L.migrationLayer({
      map: map,
      data: migrationData,
      pulseRadius: 0,
      text: transit.name
    });

    migrationLayer.addTo(map);

    if (isDetailedView) {
      setInterval(function() {
        migrationLayer.setData(migrationData);
      }, 7000);
    }
  };

  let getETA = function(origin, destintaion, transitName) {
    $.ajax({
      url: "src/php/eta.php",
      type: "post",
      dataType: "json",
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
                  {
                      console.log(moment(d.transit_details.arrival_time.text)) ;
                      var diff = moment.duration(moment(d.transit_details.arrival_time.text).diff(moment(d.transit_details.departure_time.text)));
                      console.log(diff.humanize());
                  }
                   
              });
          });
        });
      }
    });
  };

  return {
    update: init
  };
})();
