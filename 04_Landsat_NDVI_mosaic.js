//GEE short course
//Eliana Lima da Fonseca
//Universidade Federal do Rio Grande do Sul


//cloud free NDVI mosaic

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


//select the collection and filter dates
var collection = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
 .filterBounds(AOI)
 .filter(ee.Filter.lt('CLOUD_COVER', 10))
 .filterDate('2019-08-01','2019-08-31')

//ndvi as a function
function addNDVI(image) {
var ndvi_calc = image.expression("(nir - red)/(nir+red)", {
  nir : image.select("B5"),
  red : image.select("B4")}). rename("NDVI")
return image.addBands (ndvi_calc)
}

//map() a function over the collection
var collection = collection.map(addNDVI)


//The qualityMosaic() method sets each pixel in the composite based on which 
//image in the collection has a maximum value for the specified band.

var ndvi_mosaico = collection.qualityMosaic('NDVI')


// define a variable to the NDVI over AOI

var ndvi_max = ndvi_mosaico.select(['NDVI']).clip(AOI);

//draw the NDVI

var NDVI_Palette = [
      'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
      '74A901', '66A000', '529400', '3E8601', '207401', '056201',
      '004C00', '023B01', '012E01', '011D01', '011301'];


Map.addLayer (ndvi_max, {min:0, max:1, palette: NDVI_Palette }, 'max_NDVI')



//export the NDVI MVC to the Google Drive
// https://developers.google.com/earth-engine/exporting

Export.image.toDrive({
  image: ndvi_max,
  description: 'max_NDVI',
  region: AOI,
  scale: 30,
  crs: 'EPSG:4326',
  maxPixels: 1000000000000
  });
  
