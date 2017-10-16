let Sidebar = (function() {

    let col;
    let icon;
    let iconImage;
    let iconText;
    let row;
    let container;
    let map;
    let mainContainer;
    let sidebarForms;
    let attractionMarkerList = [];
    let anchorPolylineMarkerList = [];
    let isKioskSet = false;
    let kioskID;
    let imageData;
    let kioskMarker;
    uniqueNumber.previous = 0;
    let fixedAttracionUrl = "imgs/kiosks/circle.ico"
    let fixedAttracionPoint = L.icon.pulse({iconSize: [10,10], color: "#045a8d" });

    let init = function(controlMap) {
        map = controlMap;
        initUI();
    }

    let initUI = function() {
        mainContainer = document.getElementById('startOptionsContainer');
        let addKioskName = "New Kiosk";
        let addKioskId ="new";
        let addKioskIconUrl = "imgs/kiosks/add.png";
        let addKioskIconSize = [200, 200];

        container = document.createElement("div");
        container.className = "container";
        mainContainer.appendChild(container);

        row = document.createElement("div");
        row.className = "row text-center text-lg-left";
        container.appendChild(row);


        addIcon(addKioskName,addKioskId, addKioskIconUrl, addKioskIconSize);
        
        d3.json('data/results.json', function(data) {
            if(data)
            {
                console.log(data);
                _.forEach(data, function(d, i) {
                    addIcon(d.name, i, d.iconUrl, d.iconSize);
                });
            }
                

            $(".kioskIconDiv").hover(function(){
                $(this).css("opacity", 1.0);
            }, function(){
                $(this).css("opacity", 0.5);
            });

            $(".kioskIconDiv").on("click", function() {
                $('#startOptionsContainer').empty();
                initNavBar();
                initAddKioskUI();
                if(this.id=="new")
                {
                    
                     addKioskDetails();
                }
                else 
                {
                    loadKioskDetails(data, this.id);
                   

                }
                    
                    
            })
        });
    }

    let addNewAttractions = function() {
        clearMap();
        initAddNewAttractionUI();
        initAddNewAttractionMapControl();

        let fixedAttracionUrl = "imgs/kiosks/circle.ico"
        fixedAttracionPoint = L.icon({iconUrl: fixedAttracionUrl, iconSize: [10,10] });
        map.on('click', function(e){
            let coord = e.latlng.toString().split(',');
            let lat = coord[0].split('(');
            let lng = coord[1].split(')');

            let startLat;
            let startLng;
            let endLat;
            let endLng;
            let anchor;
            let attractionIcon;
            let polyline;
            
            attractionIcon = L.marker(e.latlng,{draggable: true}).addTo(map).on('move', function(d) {
                  
                if(!anchor)
                {
                    startLat = e.latlng.lat;
                    startLng = e.latlng.lng;
                }
                    
                endLat  = d.latlng.lat;
                endLng  = d.latlng.lng;

                if(anchor)
                    map.removeLayer(anchor)
                anchor = new L.marker([ startLat,  startLng], { draggable: true, icon: fixedAttracionPoint }).addTo(map);

                let polylineAttr = {
                    polyline: polyline,
                    startLat: startLat,
                    startLng: startLng,
                    endLat: endLat,
                    endLng: endLng,
                    map: map
                };

                polyline = drawPolyline(polylineAttr);
                polyline.addTo(map);
                anchorPolylineMarkerList.push(polyline);
   
            });

            attractionIcon.on('moveend', function() {
                anchorPolylineMarkerList.push(anchor);
                
                anchor.on('move', function(d) {
                        startLat = d.latlng.lat;
                        startLng = d.latlng.lng;

                        let polylineAttr = {
                            polyline: polyline,
                            startLat: startLat,
                            startLng: startLng,
                            endLat: endLat,
                            endLng: endLng,
                            map: map
                        };

                        polyline = drawPolyline(polylineAttr);
                        polyline.addTo(map);
                        anchorPolylineMarkerList.push(polyline);
                });

               
            });
            attractionMarkerList.push(attractionIcon);
        });
    }

    let initAddNewAttractionMapControl = function() {

    }

    let initAddNewAttractionUI = function() {
        clearAllNavHighlight();
        $('#addAttractionNav').css('color', '#ffeda0');
    
    }


    let addKioskDetails = function() {
        

        if(!isKioskSet)
        {
            map.on('click', function(e){
                kioskLat.value = 'Lat: ' + e.latlng.lat;
                kioskLon.value = 'Lon: ' + e.latlng.lng;
                L.marker(e.latlng, { draggable: true, icon: fixedAttracionPoint }).addTo(map).on("move", function(d) {
                    kioskLat.value = 'Lat: ' + d.latlng.lat;
                    kioskLon.value = 'Lon: ' + d.latlng.lng;
                });
                map.off('click');
                isKioskSet = true;
            });
          
        }
    }

    let loadKioskDetails = function(data, i) {
        kioskID = data[i].id;
        $('#kioskName').val(data[i].name);
        kioskLat.value = 'Lat: ' + data[i].lat;
        kioskLon.value = 'Lon: ' + data[i].lon;
     
        kioskImg.src = data[i].iconUrl;
        
        L.marker([data[i].lat, data[i].lon], { draggable: true, icon: fixedAttracionPoint }).addTo(map).on("move", function(d) {
                    kioskLat.value = 'Lat: ' + d.latlng.lat;
                    kioskLon.value = 'Lon: ' + d.latlng.lng;
        });

        imageBlob = new Blob([data[i].iconUrl], {type: 'file'});
        imageData = getBase64(imageBlob);
    
        console.log(imageData);

        map.setView(new L.LatLng(data[i].mapCenterLat, data[i].mapCenterLon), data[i].mapZoom);
    }

    let initAddKioskUI = function() {
        clearMap();
        clearAllNavHighlight();
        $('#addKioskNav').css('color', '#ffeda0');

        sidebarForms = document.getElementById('sidebarForms');
        sidebarForms.className="col-md-12";

        kioskImgTitle = document.createElement("h3")
        kioskImgTitle.id = "kioskImgTitle";
        kioskImgTitle.innerHTML = "Kiosk Image"
        sidebarForms.appendChild(kioskImgTitle);

        kioskImg = document.createElement("img");
        kioskImg.width =200;
        kioskImg.height =200;
        kioskImg.src = "http://via.placeholder.com/200x200";
        kioskImg.id = "kioskImg";

        sidebarForms.appendChild(kioskImg);

        kioskImgUpload = document.createElement("input");
        kioskImgUpload.type = "file";
        kioskImgUpload.id = "kioskImgUpload";
        kioskImgUpload.accept = ".png";
      
        sidebarForms.appendChild(kioskImgUpload);


        kioskName = document.createElement("input");
        kioskName.type = "text";
        kioskName.id = "kioskName";
    
        kioskName.placeholder = "Kiosk Name";
        sidebarForms.appendChild(kioskName);



        kioskLat = document.createElement("input");
        kioskLat.type = "text";
        kioskLat.id = "kioskLat"
      
        kioskLat.placeholder = "Kiosk Latitude";
        kioskLat.readOnly = true;
        sidebarForms.appendChild(kioskLat);
        
        kioskLon = document.createElement("input");
        kioskLon.type = "text";
        kioskLon.id = "kioskLon";
      
        kioskLon.placeholder = "Kiosk Longitude";
        kioskLon.readOnly = true;
        sidebarForms.appendChild(kioskLon);


        kioskSubmitButton = document.createElement("input")
        kioskSubmitButton.type = "button";
        kioskSubmitButton.id = "kioskSubmitButton";
        kioskSubmitButton.className = "btn btn-danger btn-lg";
        kioskSubmitButton.value = "Save";
        sidebarForms.appendChild(kioskSubmitButton);


        kioskFormStatus = document.createElement("p")
        kioskFormStatus.id = "kioskFormStatus";
        sidebarForms.appendChild(kioskFormStatus);


        $("#kioskImgUpload").change(function(){
            getBase64($("#kioskImgUpload")[0].files[0]);
            readURL(this);
        });

        $('#kioskSubmitButton').on("click", function() {
            
            if($("#kioskName").val()=="" || $("#kioskLat").val()=="" || $("#kioskLon").val()=="")
            {
                $("#kioskFormStatus").css("color","#fec44f");
                kioskFormStatus.innerHTML ="Incomplete form.";
               
            }
            else {
               d3.json('data/results.json', function(d){
                   
               });
               if(kioskID)
               {
                   $.ajax({
                        url: "src/php/sidebar.php",
                        type: "post",
                        dataType: "json",
                        cache:false,
                     
                        data: {
                            action: 'updateKiosk',
                            id: kioskID,
                            name: $("#kioskName").val(),
                            lat: $("#kioskLat").val(),
                            lon: $("#kioskLon").val(),
                            mapCenterLat: map.getCenter().lat,
                            mapCenterLon: map.getCenter().lng,
                            mapZoom: map.getZoom(),
                            image: imageData,
                        },
                        success: function(id) {
                            kioskID = id;
                            console.log(kioskID);
                            $("#kioskFormStatus").show();
                            $("#kioskFormStatus").css("color","#fec44f");
                            kioskFormStatus.innerHTML ="Saved!";
                            $("#kioskFormStatus").fadeOut( 3000, "linear");;
                        }
                    });
               }
               else{
                    $.ajax({
                        url: "src/php/sidebar.php",
                        type: "post",
                        dataType: "json",
            
                        data: {
                            action: 'addKiosk',
                            id: ID(),
                            name: $("#kioskName").val(),
                            lat: $("#kioskLat").val(),
                            lon: $("#kioskLon").val(),
                            mapCenterLat: map.getCenter().lat,
                            mapCenterLon: map.getCenter().lng,
                            mapZoom: map.getZoom(),
                            image: imageData
                        },
                        success: function(id) {
                            kioskID = id;
                            console.log(kioskID);
                            
                            $("#kioskFormStatus").show();
                            $("#kioskFormStatus").css("color","#fec44f");
                            kioskFormStatus.innerHTML ="Saved!";
                            $("#kioskFormStatus").fadeOut( 3000, "linear");;
                        }
                    });
               }
               
                
            }

        });

        
    }

    let clearMap = function() {
        map.off('click');
        _.forEach(anchorPolylineMarkerList, function(d){
            if(d)
                map.removeLayer(d)
        });

        _.forEach(attractionMarkerList, function(d){
            if(d)
                map.removeLayer(d)
        });

        $('#sidebarForms').empty();

    }

    let drawPolyline = function(polylineAttr) {

        if(polylineAttr.polyline)
            polylineAttr.map.removeLayer(polylineAttr.polyline)
        let pointA = new L.LatLng(polylineAttr.startLat, polylineAttr.startLng);
        let pointB = new L.LatLng(polylineAttr.endLat, polylineAttr.endLng);
        let pointList = [pointA, pointB];
        polylineAttr.polyline = new L.Polyline(pointList, {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        });
        return polylineAttr.polyline;
    }

 
    let clearAllNavHighlight = function() {
        let navs = $('.menuNavLinks');
        _.forEach(navs, function(d) {
            $(d).css('color','white');
        })
    }

    let initNavBar = function() {
        menuBar = document.createElement("div");
        menuBar.className = "menuBar";
        mainContainer.appendChild(menuBar);

        
        navTextKiosk = document.createElement('a');
        navTextKiosk.className = "menuNavLinks";
        navTextKiosk.id = "addKioskNav";
        navTextKiosk.href="#";
        navTextKiosk.innerHTML = "Kiosk";
        menuBar.appendChild(navTextKiosk);

        navTextAttraction = document.createElement('a');
        navTextAttraction.className = "menuNavLinks";
        navTextAttraction.id = "addAttractionNav";
        navTextAttraction.href="#";
        navTextAttraction.innerHTML = "Attractions";
        menuBar.appendChild(navTextAttraction);

        navTextTransit = document.createElement('a');
        navTextTransit.className = "menuNavLinks";
        navTextTransit.href="#";
        navTextTransit.innerHTML = "Transit";
        menuBar.appendChild(navTextTransit);

        navTextSimulation = document.createElement('a');
        navTextSimulation.className = "menuNavLinks";
        navTextSimulation.href="#";
        navTextSimulation.innerHTML = "Simulation";
        menuBar.appendChild(navTextSimulation);

        $('#addKioskNav').on('click', function() {
            addKioskDetails();
        });

        $('#addAttractionNav').on('click', function() {
            addNewAttractions();
        });


    }

    let addIcon = function(name, id, iconUrl, iconSize) {
        col = document.createElement("div");
        col.id = id;
        col.className = "col-lg-3 col-md-4 col-xs-6 kioskIconDiv";
        row.appendChild(col);

        icon = document.createElement("a");
        icon.href="#";
        icon.className= "d-block mb-4 h-100";
        col.appendChild(icon);

        iconImage= document.createElement("img");
        iconImage.className = "img-fluid kiosk-img-thumbnail";
        iconImage.src = iconUrl;
        iconImage.width = iconSize[0];
        iconImage.height = iconSize[1];
        icon.appendChild(iconImage);

        iconText = document.createElement('div');
        iconText.className = "kioskName";
        iconText.innerHTML = name;
        icon.appendChild(iconText);
    }


    function uniqueNumber() {
        let date = Date.now();
        
        if (date <= uniqueNumber.previous) {
            date = ++uniqueNumber.previous;
        } else {
            uniqueNumber.previous = date;
        }

        return date;
    }

    function ID(){
        return uniqueNumber();
    };

    function readURL(input) {
        if (input.files && input.files[0]) {
           
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#kioskImg')
                    .attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            imageData = reader.result;
            // console.log(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    
    return {
        init: init
    }
})();