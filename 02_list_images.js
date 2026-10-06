//GEE short course
//Eliana Lima da Fonseca
//Universidade Federal do Rio Grande do Sul


//Choose the Landsat images over the AOI 

// Selecionar Bagé diretamente com um único filtro combinado
var AOI = ee.FeatureCollection("FAO/GAUL/2015/level2").filter(ee.Filter.and(
  ee.Filter.eq('ADM0_NAME', 'Brazil'),
  ee.Filter.eq('ADM1_NAME', 'Rio Grande Do Sul'),
  ee.Filter.eq('ADM2_NAME', 'Bage')
));

//Desenha o contorno da área de interesse (AOI)
var empty = ee.Image().byte();

var outline = empty.paint({
  featureCollection: AOI,
  color: 1,
  width: 1});
Map.addLayer(outline, {palette: 'FF0000'}, 'AOI');

//Center the map
Map.centerObject(AOI, 7);
Map.setOptions('satellite');

//Selected the entire image collection 
var col = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
// https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC09_C02_T1_TOA

// filters
var col = col
 .filterBounds(AOI)
 .filter(ee.Filter.lt('CLOUD_COVER', 10))
 .filterDate('2023-01-01','2023-03-31')
 
/*
//2.Seleciona a coleção de imagens Landsat 
var col = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')

var show = col
 .filterBounds(AOI)
   .filter(ee.Filter.lt('CLOUD_COVER', 10))
 .filterDate('2019-08-01','2019-08-31')
//print(col);
*/

 
// Get the number of filtered images
var count = col.size()
print('Number of images',count );
// Get the list of images.
var imgList = col.toList(count);
print(imgList);

//visualize the images footprint:

var wrs2_descending = ee.FeatureCollection("projects/ee-elf-cloud/assets/WRS2_descending_0");

// intersection: (path/row x aoi)
var wrs2_AOI = wrs2_descending.filterBounds(AOI);

//snippet to draw the footprints
 var empty = ee.Image().byte();
 var outline = empty.paint({
   featureCollection: wrs2_AOI, //here choose a feature collection to draw
   color: 1,
   width: 1
 });
 Map.addLayer(outline, {palette: '000000'}, 'Path_Row edges');

// snippet to write the Path_Row names
var text = require('users/gena/packages:text')
var Scale = Map.getScale()*1
var labels = wrs2_AOI.map(function(feat){
  feat = ee.Feature(feat)
  var name = ee.String (feat.get("WRSPR"))
  var centroid = feat.geometry().centroid()
  var t = text.draw(name, centroid,Scale,{
    fontSize: 10,
    textColor:'Red',
     OutlineWidth:0.5,
     OutlineColor:'white'})
  return t
  })
var Labels_Final = ee.ImageCollection(labels)
Map.addLayer(Labels_Final,{},"Path_Row names")
  

//snippet to visualize the images
var rgbVis = {min: 0.0, max: 0.3, bands: ['B4', 'B3', 'B2']};

function addImage(image) { // display each image
  var id = image.id;
  var iMage = ee.Image(image.id);
  Map.addLayer(iMage, rgbVis, id, false);
}

col.evaluate(function(desenha) {  //evaluate the collection  
  desenha.features.map(addImage);  // map 'addImage' over the imagecollection
});


//snippet to get a list of the selected layers

var buttonShowSelected = ui.Button('List selected layers')

buttonShowSelected.onClick(function() {
  var layers = Map.layers()
  var selected = []
  var selectedObjects = []
  for(var i=0; i<layers.length(); i++) {
    var l = layers.get(i)
    if(l.getShown()) {
      selected.push(ui.Label(l.getName()))
      selectedObjects.push(l.getEeObject())}
  }
print('Selected layers:',selectedObjects)
}) // end of the function
Map.add(buttonShowSelected) //end of the snippet



