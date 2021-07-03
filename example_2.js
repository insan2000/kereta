$(function() {
    // Setup leaflet map
    var map = new L.Map('map').setView([-7.352914, 111.590170], 9); //Center map and default zoom level

    var basemapLayer = new L.TileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    });

    // ALERT ???????????????????????????????????????????????????????????
    function cari() {
    alert ('tombol ditekan!');
    }
    map.locate({setView: true, maxZoom: 16});
    function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
    }
    map.on('locationfound', onLocationFound);

    // Adds the background layer to the map
    map.addLayer(basemapLayer);

    // Style dan POPUP JSON Jalur Kereta
    var myStyle = {
        "color": "#ff0000",
        "weight": 2,
        "opacity": 0.65
    };
    var myStyle2 = {
        "color": "#0000FF",
        "weight": 2,
        "opacity": 0.65
    };

    var state = L.icon({
        iconUrl: 'images/stasiun2.png',
        iconSize: [15, 15],
        iconAnchor: [4, 13],
        popupAnchor: [3, -12]
    });
    


    function popUp(f,l){
        var out = [];
        if (f.properties){
            // for(key in f.properties){
            //  console.log(key);
            // }
            out.push("FID: "+" "+f.properties["FID"]);
            out.push("Objectid: "+" "+f.properties["objectid"]);
            out.push("Ini Jalur Rel Kereta Api");
            l.bindPopup(out.join("<br />"));
        }
    }

    function popUpStasiun(f,l){
        var out = [];
        if (f.properties){
            // for(key in f.properties){
            //  console.log(key);
            // }
            out.push(f.properties["Stasiun"]);
            out.push("Koordinat: "+" "+f.properties["lat"]+", "+f.properties["lon"]);
            l.bindPopup(out.join("<br />"));
        }
    }

    // LEGENDA ????????????
    function iconByName(name) {
        return '<i class="icon icon-'+name+'"></i>';
    }

    function featureToMarker(feature, latlng) {
        return L.marker(latlng, {
            icon: L.divIcon({
                className: 'marker-'+feature.properties.amenity,
                html: iconByName(feature.properties.amenity),
                iconUrl: '../images/markers/'+feature.properties.amenity+'.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        });
    }

    function featureToMarkerStasiun(feature, latlng) {
        return L.marker(latlng, {
            icon: L.divIcon({
                className: 'marker-'+feature.properties.namobj,
                html: iconByName(feature.properties.namobj),
                iconUrl: 'images/stasiun2.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        });
    }

    var baseLayers = [
        {
            group: "Basemap Layers",
            icon: iconByName ('parking'),
            collapsed: true,
            layers: [
                {
                    name: "OpenStreetMap",
                    layer: basemapLayer
                },
                {
                    name: "OpenStreetMap_Mapnik",
                    layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})
                },
                {
                    name: "Outdoors",
                    layer: L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png')
                },
                {
                    name: "OpenRailwayMap",
                    layer: L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'})
                },
                {
                    name: "Citra Esri",
                    layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'})
                },
                {
                    name: "Citra Google Hybrid",
                    layer: L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains:['mt0','mt1','mt2','mt3'],
                    attribution: 'Map by <a href="https://maps.google.com/">Google</a>'})
                }
            ]
        }
    ];

    var overLayers = [
        {
            name: "Rel Kereta Semarang - Surabaya",
            icon: iconByName('bar'),
            layer: new L.GeoJSON.AJAX(["data/json_1.json"],{onEachFeature:popUp,style: myStyle,pointToLayer: featureToMarker}).addTo(map)
        },
        {
            name: "Rel Kereta Surabaya - Semarang",
            icon: iconByName('drinking_water'),
            layer: new L.GeoJSON.AJAX(["data/json_2.json"],{onEachFeature:popUp,style: myStyle2,pointToLayer: featureToMarker}).addTo(map)
        },
        {
            name: "Daftar Stasiun",
            icon: iconByName('fuel'),
            layer: new L.GeoJSON.AJAX(
                ["data/daftar_stasiun.json"],
                {onEachFeature:popUpStasiun, icon : state})
                // ,pointToLayer: featureToMarker
            .addTo(map)
        }
    ];

    var panelLayers = new L.Control.PanelLayers(baseLayers, overLayers, {
        collapsibleGroups: true,
        collapsed: true
    });

    map.addControl(panelLayers);

    // Masih Zoom to Stasiun ?????????????????????????????????????????????????
    var zoomTo1 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer1 = zoomTo1.getContainer();
        $("#zoomke1").append(layerControlContainer1);

    var zoomTo2 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer2 = zoomTo2.getContainer();
        $("#zoomke2").append(layerControlContainer2);

    var zoomTo3 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer3 = zoomTo3.getContainer();
        $("#zoomke3").append(layerControlContainer3);

    var zoomTo4 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer4 = zoomTo4.getContainer();
        $("#zoomke4").append(layerControlContainer4);

    var zoomTo5 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer5 = zoomTo5.getContainer();
        $("#zoomke5").append(layerControlContainer5);

    var zoomTo6 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer6 = zoomTo6.getContainer();
        $("#zoomke6").append(layerControlContainer6);

    var zoomTo7 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer7 = zoomTo7.getContainer();
        $("#zoomke7").append(layerControlContainer7);

    var zoomTo8 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer8 = zoomTo8.getContainer();
        $("#zoomke8").append(layerControlContainer8);

    var zoomTo9 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer9 = zoomTo9.getContainer();
        $("#zoomke9").append(layerControlContainer9);

    var zoomTo10 = L.easyButton( 'fa-search-plus', function(){
            alert('Ubah waktu secara manual menggunakan time slider menjadi pukul 09.00 AM');
            map.setView([-6.97277222927478, 110.414575144596], 18);
          }).addTo(map);
          var layerControlContainer10 = zoomTo10.getContainer();
        $("#zoomke10").append(layerControlContainer10);

    // Colors for AwesomeMarkers
    var _colorIdx = 0,
        _colors = [
          'green',
          'red',
          'blue',
          'darkpurple'
        ];
        
    function _assignColor() {
        return _colors[_colorIdx++%10];
    }
    
    
    // =====================================================
    // =============== Playback ============================
    // =====================================================

    // Playback options
    var playbackOptions = {        
        // layer and marker options
        layer: {
            pointToLayer : function(featureData, latlng){
                var result = {};
                
                if (featureData && featureData.properties && featureData.properties.path_options){
                    result = featureData.properties.path_options;
                }
                
                if (!result.radius){
                    result.radius = 5;
                }
                
                return new L.CircleMarker(latlng, result);
            }
        },
        
        marker: function(){
            return {
                icon: L.AwesomeMarkers.icon({
                    prefix: 'fa',
                    icon: 'train', 
                    markerColor: _assignColor()
                }),
                getPopup: function (feature) {
                return feature.properties.title;}  
            };
        },
        popups: true,
        fadeMarkersWhenStale: true,
        tracksLayer : false        
    };
    
    // Initialize playback
    var playback = new L.Playback(map, demoTracks, null, playbackOptions);
    
    // Initialize custom control
    var control = new L.Playback.Control(playback);
    control.addTo(map);
    
    // Add data
    playback.addData(ka269f, ka267, ka1, ka3, ka129, ka255, ka108, ka127, ka123, ka77, ka240f, ka268f,
ka268, ka2, ka4, ka130, ka256, ka106, ka128, ka125, ka78, ka238f);
       
});
