let Animation = (function() {
  
    let init = function() {

    };

    let drawCurveLine = function(map, startCoordinates, endCoordinates, color, transit) {

        let latlngs1 = [startCoordinates.lat, startCoordinates.lon];
        let latlngs2 = [endCoordinates.lat, endCoordinates.lon];
        let midpointLatLng = getMidPointLatLng(latlngs1, latlngs2);


        let curvedPath = L.d3SvgOverlay(function(sel,proj){ 

            let transitCircle;

            let pathPoints = getPath(proj, latlngs1, latlngs2, midpointLatLng);

            let path = drawPath(sel, pathPoints, color);

            let badge = drawBadge(sel, pathPoints, color);

            _.times(transit.frequency, function(index) {
                transitCircle = drawTransitCircle(sel, pathPoints, color, transit);
                transitionAnim(transitCircle, path, transit.travelTime, index);
              
            });
           
        });

        curvedPath.addTo(map);

    };

    let getMidPointLatLng = function(latlngs1, latlngs2) {

        let offsetX  = latlngs2[1] - latlngs1[1];
        let offsetY = latlngs2[0] - latlngs1[0];

        let r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
        let theta = Math.atan2(offsetY, offsetX);

        let thetaOffset = (3.14/10)

        let r2 = (r/2)/(Math.cos(thetaOffset));
        let theta2 = theta + thetaOffset;

        let midpointX = (r2 * Math.cos(theta2)) + latlngs1[1];
        let midpointY = (r2 * Math.sin(theta2)) + latlngs1[0];

        return [midpointY, midpointX];
    }

    let getPath = function(proj, latlngs1, latlngs2, midpointLatLng) {
        return[
            [proj.latLngToLayerPoint(latlngs1).x, proj.latLngToLayerPoint(latlngs1).y],
            [proj.latLngToLayerPoint(midpointLatLng).x, proj.latLngToLayerPoint(midpointLatLng).y],
            [proj.latLngToLayerPoint(latlngs2).x, proj.latLngToLayerPoint(latlngs2).y]
        ];
    }

    let drawPath = function(sel, pathPoints, color) {
        return sel.append("path")
                .data([pathPoints])
                .attr("class", "transitPath")
                .attr("stroke", color)
                .attr("d", d3.svg.line()
                .tension(0)
                .interpolate("cardinal"));
    }

    let drawBadge = function(sel, pathPoints, color) {
        
        let midpointXY = pathPoints[1];

        let badge =  sel.selectAll(".point")
                .data([midpointXY])
                .enter().append("circle")
                .attr("r", 15)
                .attr("class", "transitBadge")
                .attr("fill", color)
                .attr("transform", function(d) { return "translate(" + d + ")"; });

    }

    let drawTransitCircle = function(sel, pathPoints, color, transit) {
            return sel.append("circle")
                .attr("r", 6)
                .attr("class", "transitCircle")
                .attr("transform", "translate(" + pathPoints[0] + ")")
                .attr("fill", color);
    };

    let transitionAnim = function(transitCircle, path, travelTime, delayFactor) {
        let delayBaseForTravel = 1000;
        let delayBaseForTransit = 10000;
        let duration = delayBaseForTravel * travelTime;
        transitCircle.transition()
                .duration(duration)
                .delay(delayBaseForTransit * delayFactor)
                .attrTween("transform", translateAlong(path.node()))
                .each("end", function(){
                    transitionAnim(transitCircle, path, travelTime, delayFactor);
                });
    }

    let translateAlong = function(path) {
        let l = path.getTotalLength();
        return function(d, i, a) {
            return function(t) {
            let p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ")";
            };
        };
    }

    let cleanUpAnim = function() {
        $('.transitPath').remove();
        $('.transitBadge').remove();
        $('.transitCircle').remove();
    };


    return {
        init: init,
        drawCurvePath: drawCurveLine,
        clear: cleanUpAnim
    }

})();