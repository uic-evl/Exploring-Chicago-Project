let Animation = (function() {
    let init = function() {

    };

    let drawCurveLine = function(map, startCoordinates, endCoordinates, color) {
        let latlngs = [];
        let latlngs1 = [startCoordinates.lat, startCoordinates.lon];
        let latlngs2 = [endCoordinates.lat, endCoordinates.lon];

        var layerPoint = map.latLngToLayerPoint(latlngs1);



        let offsetX  = latlngs2[1] - latlngs1[1];
        let offsetY = latlngs2[0] - latlngs1[0];

        let r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
        let theta = Math.atan2(offsetY, offsetX);

        let thetaOffset = (3.14/10)

        let r2 = (r/2)/(Math.cos(thetaOffset));
        let theta2 = theta + thetaOffset;

        let midpointX = (r2 * Math.cos(theta2)) + latlngs1[1];
        let midpointY = (r2 * Math.sin(theta2)) + latlngs1[0];

        let midpointLatLng = [midpointY, midpointX];



        let curvedPath = L.d3SvgOverlay(function(sel,proj){ 

        let pathPoints = [
                        [proj.latLngToLayerPoint(latlngs1).x, proj.latLngToLayerPoint(latlngs1).y],
                        [proj.latLngToLayerPoint(midpointLatLng).x, proj.latLngToLayerPoint(midpointLatLng).y],
                        [proj.latLngToLayerPoint(latlngs2).x, proj.latLngToLayerPoint(latlngs2).y]
                       ];
         let path = sel.append("path")
            .data([pathPoints])
            .attr("class", "transitPath")
            .attr("stroke", color)
            .attr("d", d3.svg.line()
            .tension(0)
            .interpolate("cardinal"));


        sel.selectAll(".point")
           .data(pathPoints)
           .enter().append("circle")
           .attr("r", 4)
           .attr("transform", function(d) { return "translate(" + d + ")"; });

        let circle = sel.append("circle")
            .attr("r", 6)
            .attr("transform", "translate(" + pathPoints[0] + ")")
            .attr("fill", color);

        function transition() {
                circle.transition()
                    .duration(10000)
                    .attrTween("transform", translateAlong(path.node()))
                    .each("end", transition);
        }


        transition();

        function translateAlong(path) {
            let l = path.getTotalLength();
            return function(d, i, a) {
                return function(t) {
                let p = path.getPointAtLength(t * l);
                return "translate(" + p.x + "," + p.y + ")";
                };
            };
        }


        });

        curvedPath.addTo(map);

    };


    return {
        init: init,
        drawCurvePath: drawCurveLine
    }

})();