var view = new ol.View({
    projection: 'EPSG:4326',
    center: [70.97667574234188, 20.716470556284726],
    zoom: 15.047395063939724
});

//here i am defining new control with extending openlayers default control
//custom control for create point
var button = document.createElement('button');
button.innerHTML = '<i class="fas fa-pencil-ruler"></i>';
button.id='createpointid';
var handleRotateNorth = function() {
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
buttonlegend.id='legendid';
var legendfun = function() {
    slegend();
};
buttonlegend.addEventListener('click', legendfun, false);
var element = document.createElement('div');
element.className = 'legend-class ol-unselectable ol-control';
element.appendChild(buttonlegend);
var legendControl = new ol.control.Control({
    element: element
});
//custom control for open  database Table
var buttonDbTable = document.createElement('button');
buttonDbTable.innerHTML = '<i class="fa-solid fa-table-list"></i>';
buttonDbTable.id='tableid';
var table = function() {
    closeTble();
};
buttonDbTable.addEventListener('click', table, false);
var element = document.createElement('div');
element.className = 'table-class ol-unselectable ol-control';
element.appendChild(buttonDbTable);
var tableControl = new ol.control.Control({
    element: element
});
//here i am ending new control with extending openlayers default control

var map = new ol.Map({
    target: 'map',
    view: view
});
var layerosm = new ol.layer.Tile({
    title:"osm",
    source: new ol.source.OSM()
});
var wmsKlTasjSource = new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/VWRIS/wms',
    params: { 'LAYERS': 'VWRIS:database' },
    servertype: 'geoserver',
    crossOrigin: 'anonymous'
});
var wmsKlTaskLayer = new ol.layer.Image({
    visible: true,
    //extent: [71.46409117326702, 21.62483263358209, 74.73231625985055, 22.856996557147635],
    title: "Surveyed Layer",
    source: wmsKlTasjSource
});
var layerSwitcher = new ol.control.LayerSwitcher({
 
});
map.addControl(layerSwitcher);
map.addLayer(layerosm);
map.addLayer(wmsKlTaskLayer);

//Adding extended contrl over here
map.addControl(createPointControl);
map.addControl(legendControl);
map.addControl(tableControl);

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


function savedataintodb(){
    //alert("submited btn clicked")
    var featuresname = document.getElementById('ename').value;
    var featuretype = document.getElementById('ddlpointtype').value;
    var ulong = pointCordainate[0];
    var ulat = pointCordainate[1];
    //console.log(featuresname,featuretype,ulat,ulong);

    if(featuresname=='' || featuretype=='' || ulong=='' || ulat==''){
        debugger;
        alert("please enter all details");
    }else{
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
function clearAddPoint(){
    map.removeInteraction(drawPoint);
    vSource.clear();
    $("#myModal").modal('hide');
    // $("#divaddpoint").hide();
}

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


