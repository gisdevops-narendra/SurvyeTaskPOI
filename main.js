var content;
var flagIsDrawingOn = false
var view = new ol.View({
    projection: 'EPSG:4326',
    center: [70.97667574234188, 20.716470556284726],
    zoom: 15.047395063939724
});
//here i am defining new control with extending openlayers default control
//custom control for create point
var button = document.createElement('button');
button.innerHTML = '<i class="fas fa-pencil-ruler"></i>';
button.id = 'createpointid';
var handleRotateNorth = function () {
    startDrawing();
};
button.addEventListener('click', handleRotateNorth, false);
var element = document.createElement('div');
element.className = 'create-point-class ol-unselectable ol-control';
element.appendChild(button);
var createPointControl = new ol.control.Control({
    element: element
});
//custom control for legend showing
var buttonlegend = document.createElement('button');
buttonlegend.innerHTML = '<i class="fa-solid fa-image-portrait"></i>';
buttonlegend.id = 'legendid';
var legendfun = function () {
    slegend();
};
buttonlegend.addEventListener('click', legendfun, false);
var element = document.createElement('div');
element.className = 'legend-class ol-unselectable ol-control';
element.appendChild(buttonlegend);
var legendControl = new ol.control.Control({
    element: element
});
//custom control for database Table hide and show
var buttonDbTable = document.createElement('button');
buttonDbTable.innerHTML = '<i class="fa-solid fa-table-list"></i>';
buttonDbTable.id = 'tableid';
var table = function () {
    closeTble();
};
buttonDbTable.addEventListener('click', table, false);
var element = document.createElement('div');
element.className = 'table-class ol-unselectable ol-control';
element.appendChild(buttonDbTable);
var tableControl = new ol.control.Control({
    element: element
});
//custom control for feature inforamtion 
var buttonInformation = document.createElement('button');
buttonInformation.innerHTML = '<i class="fa-solid fa-info"></i>';
buttonInformation.id = 'infoid';
var information = function () {
    getinfo();
};
buttonInformation.addEventListener('click', information, false);
var element = document.createElement('div');
element.className = 'information-class ol-unselectable ol-control';
element.appendChild(buttonInformation);
var featureInfoarmtion = new ol.control.Control({
    element: element
});
//custom control for Creating Line Features
var buttonLineCreate = document.createElement('button');
buttonLineCreate.innerHTML = '<i class="fa-solid fa-road"></i>';
buttonLineCreate.id = 'lineid';
var drawLineFun = function () {
    startDrawingLine();
};
buttonLineCreate.addEventListener('click', drawLineFun, false);
var element = document.createElement('div');
element.className = 'lineCreate-class ol-unselectable ol-control';
element.appendChild(buttonLineCreate);
var lineCreateControl = new ol.control.Control({
    element: element
});
//here i am ending new control with extending openlayers default control
var map = new ol.Map({
    target: 'map',
    view: view
});
var layerosm = new ol.layer.Tile({
    title: "osm",
    source: new ol.source.OSM()
});
var overlayers = new ol.layer.Group({
    title: 'Database Layer',
    layers: [
        new ol.layer.Image({
            visible: true,
            title: "database",
            source: new ol.source.ImageWMS({
                url: 'http://localhost:8080/geoserver/VWRIS/wms',
                params: { 'LAYERS': 'VWRIS:database' },
                servertype: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }),
        new ol.layer.Image({
            visible: true,
            title: "database",
            source: new ol.source.ImageWMS({
                url: 'http://localhost:8080/geoserver/VWRIS/wms',
                params: { 'LAYERS': 'VWRIS:line' },
                servertype: 'geoserver',
                crossOrigin: 'anonymous'
            })
        })

    ]
});
// var wmsKlTasjSource = new ol.source.ImageWMS({
//     url: 'http://localhost:8080/geoserver/VWRIS/wms',
//     params: { 'LAYERS': 'VWRIS:database' },
//     servertype: 'geoserver',
//     crossOrigin: 'anonymous'
// });
// var wmsKlTaskLayer = new ol.layer.Image({
//     visible: true,
//     //extent: [71.46409117326702, 21.62483263358209, 74.73231625985055, 22.856996557147635],
//     title: "database",
//     source: wmsKlTasjSource
// });
var layerSwitcher = new ol.control.LayerSwitcher({
});
map.addControl(layerSwitcher);
map.addLayer(layerosm);
//map.addLayer(wmsKlTaskLayer);
map.addLayer(overlayers);
//Adding extended contrl over here
map.addControl(createPointControl);
map.addControl(lineCreateControl);
map.addControl(legendControl);
map.addControl(tableControl);
map.addControl(featureInfoarmtion);
var popup = new Popup();
map.addOverlay(popup);
// get button id so on click we draw the point
var startDraw = document.getElementById('icon');
//create a vector sources so that use for vector data
var vSource = new ol.source.Vector();
//create vector layer for vector source
var vLayer = new ol.layer.Vector({
    source: vSource
});
map.addLayer(vLayer);
//here i have to firstly initalise the draw event
var drawPoint = new ol.interaction.Draw({
    source: vSource,//above source vector source
    type: 'Point' //linestring,polygon
});
//clear draw on again draw start
drawPoint.on('drawstart', function (e) {
    //debugger;
    vSource.clear();
    //alert("draw start");
});
$('.modal-dialog').draggable({
    handle: ".modal-header"
});
drawPoint.on('drawend', function (cordinate) {
    $("#myModal").modal('show');

    // $("#myModal").show();
    debugger;
    pointCordainate = cordinate.feature.getGeometry().getFlatCoordinates();

    //console.log(cordinate.feature.getGeometry().getFlatCoordinates());
    //alert(cordinate.feature.getGeometry().getFlatCoordinates())
    //alert(pointCordainate);
    //alert("draw end");
});
function startDrawing() {
    // debugger;
    map.addInteraction(drawPoint);
};
function savedataintodb() {
    //alert("submited btn clicked")
    var featuresname = document.getElementById('ename').value;
    var featuretype = document.getElementById('ddlpointtype').value;
    var ulong = pointCordainate[0];
    var ulat = pointCordainate[1];
    //console.log(featuresname,featuretype,ulat,ulong);

    if (featuresname == '' || featuretype == '' || ulong == '' || ulat == '') {
        debugger;
        alert("please enter all details");
    } else {
        $.ajax(
            {
                url: 'data.php',
                type: 'POST',
                //dataType:'json',
                data:
                {
                    fname: featuresname,
                    ftype: featuretype,
                    longitude: ulong,
                    latitude: ulat
                },
                success: function (data) {
                    $("#myModal").modal('hide');
                    // $("#myModal").hide();
                    vSource.clear();
                    map.removeInteraction(drawPoint);
                    $("#featuresData").html(data);
                    $("#tble-data").css("display", "block");
                    $("#legend").css("display", "block");
                    $("#ename").val('');
                    $("#ddlpointtype").val('');

                    //alert(result);
                }
            }
        )
    };
}
function clearAddPoint() {
    map.removeInteraction(drawPoint);
    vSource.clear();
    $("#myModal").modal('hide');
    // $("#divaddpoint").hide();
}

//Starting: Line Drawing Code--------------------------****************************************************************************----?
// 1 . Define source
var vectorSourceLine = new ol.source.Vector();
// 2. Define layer
var vectorLayerLine = new ol.layer.Vector({
    source: vectorSourceLine
});
map.addLayer(vectorLayerLine);
//here i have to firstly initalise the draw event
var drawLine = new ol.interaction.Draw({
    source: vectorSourceLine,//above source vector source
    type: 'LineString' //linestring,polygon
});
//clear draw on again draw start
drawLine.on('drawstart', function (e) {
    // debugger;
    // vectorSourceLine.clear();
    //alert("draw start");
});
$('.modal-dialog').draggable({
    handle: ".modal-header"
});
drawLine.on('drawend', function (cordinate) {
    $("#myModalLine").modal('show');
    // $("#myModal").show();
    //debugger;
    // lineCordinate = cordinate.feature.getGeometry().getCoordinates();
    //console.log(lineCordinate);

    //console.log(cordinate.feature.getGeometry().getFlatCoordinates());
    //alert(cordinate.feature.getGeometry().getFlatCoordinates())
    //alert(pointCordainate);
    //alert("draw end");
});
function startDrawingLine() {
    //  debugger;
    map.addInteraction(drawLine);
};

function saveLineDataIntoDB() {
    // get array of all features 
    var featureArray = vectorSourceLine.getFeatures()
    //  // Define geojson format 
    var geogJONSformat = new ol.format.GeoJSON()
    //  // Use method to convert feature to geojson
    var featuresGeojson = geogJONSformat.writeFeaturesObject(featureArray)
    //  // Array of all geojson
    var geojsonFeatureArray = featuresGeojson.features
    // debugger;
    for (i = 0; i < geojsonFeatureArray.length; i++) {
        //alert("submited btn clicked")
        var featuresname = document.getElementById('enameLine').value;
        //  alert(featuresname);
        var featuretype = document.getElementById('ddlLinetype').value;
        //  alert(featuretype);
        ucord = JSON.stringify(geojsonFeatureArray[i].geometry)
        // debugger;
        // alert(ucord);
        //var ulat = lineCordinate;

        //console.log(featuresname,featuretype,ulat,ulong);

        if (featuresname == '' || featuretype == '' || ucord == '') {
            //  debugger;
            alert("please enter all details");
        } else {
            $.ajax(
                {
                    url: 'dataLine.php',
                    type: 'POST',
                    //dataType:'json',
                    data:
                    {
                        fname: featuresname,
                        ftype: featuretype,
                        fcordin: ucord,

                    },
                    success: function (data) {
                        $("#myModalLine").modal('hide');
                        // $("#myModal").hide();
                        vectorSourceLine.clear();
                        map.removeInteraction(drawLine);
                        $("#tble-data-line").html(data);
                        $("#tble-data-line").css("display", "block");
                        $("#legend").css("display", "block");
                        $("#enameLine").val('');
                        $("#ddlLinetype").val('');
                        //alert(result);
                    }
                }
            )
        };
    }
}
function clearAddPoint() {
    debugger;
    map.removeInteraction(drawLine);
    vectorSourceLine.clear();
    $("#myModalLine").modal('hide');
    // $("#divaddpoint").hide();
}
//Ending: Line Drawing code-----------------------*****************************************----------------------------->
const updateLegend = function (resolution) {
    const graphicUrl = wmsKlTasjSource.getLegendUrl(resolution);
    const img = document.getElementById('legend');
    img.src = graphicUrl;
};
// Initial legend
const resolution = map.getView().getResolution();
updateLegend(resolution);
// Update the legend when the resolution changes
map.getView().on('change:resolution', function (event) {
    const resolution = event.target.getResolution();
    updateLegend(resolution);
});
function slegend() {
    var x = document.getElementById("legend");
    if (x.style.display == "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}
function closeTble() {
    var y = document.getElementById("tble-data");
    if (y.style.display == "block") {
        y.style.display = "none";
    } else {
        y.style.display = "block";
    }
}
function getinfo() {
    flagIsDrawingOn = true;
    document.getElementById('infoid').innerHTML = '<i class="far fa-stop-circle"></i>'
    map.on('singleclick', function (evt) {
        var viewResolution = (view.getResolution());
        if (popup) {
            popup.hide();
        }
        if (content) {
            content = '';
        }
        map.getLayers().getArray().slice().forEach(layer => {
            var layer_title = layer.get('title');
            var wmsSource = new ol.source.ImageWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: {
                    'LAYERS': layer_title
                },
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            });
            var url = wmsSource.getFeatureInfoUrl(
                evt.coordinate, viewResolution, 'EPSG:4326', {
                'INFO_FORMAT': 'text/html'
            });
            $.get(url, function (data) {
                popup.show(evt.coordinate, data);
            });

        });
    })

}
