var view = new ol.View({
    projection: 'EPSG:4326',
    center: [70.97667574234188, 20.716470556284726],
    zoom: 15.047395063939724
});
var map = new ol.Map({
    target: 'map',
    view: view
});

var layerosm = new ol.layer.Tile({
    title:"osm",
    source: new ol.source.OSM()
});

var wmsCanalSource = new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/VWRIS/wms',
    params: { 'LAYERS': 'VWRIS:kltask' },
    servertype: 'geoserver',
    crossOrigin: 'anonymous'
});
var wmscanalLayer = new ol.layer.Image({
    visible: true,
    //extent: [71.46409117326702, 21.62483263358209, 74.73231625985055, 22.856996557147635],
    title: "kllayer",
    source: wmsCanalSource
});
var layerSwitcher = new ol.control.LayerSwitcher({
 
});
map.addControl(layerSwitcher);
map.addLayer(layerosm);
map.addLayer(wmscanalLayer);

// get button id so on click we draw the point
var startDraw = document.getElementById('icon');

//create a vector sources so that use for vector data
var vSource = new ol.source.Vector();

//create vector layer for vector source
var vLayer = new ol.layer.Vector({
    source: vSource
});
//add on map
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

drawPoint.on('drawend', function (cordinate) {
    $("#divaddpoint").show();
   // debugger;
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
                $("#divaddpoint").hide();
                map.removeLayer(drawPoint);
                map.removeInteraction(drawPoint);
                $("#featuresData").html(data);
                $("#tble-data").css("display", "block");
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
    $("#divaddpoint").hide();
}

const updateLegend = function (resolution) {
    const graphicUrl = wmsCanalSource.getLegendUrl(resolution);
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


