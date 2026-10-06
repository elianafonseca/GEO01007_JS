
// Índices de vegetação
// Eliana Lima da Fonseca

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
//Map.centerObject(AOI, 7);
Map.setCenter(-53.9, -31.25, 9);
Map.setOptions('satellite');

//seleciona e desenha as images de interesse
var image = ee.Image("LANDSAT/LC08/C02/T1_TOA/LC08_222082_20190806").clip(AOI);
Map.addLayer (image, {min:0, max:0.3, bands: ["B4", "B3", "B2"]}, '222_082')

var image2 = ee.Image("LANDSAT/LC08/C02/T1_TOA/LC08_223082_20190829").clip(AOI);
Map.addLayer (image2, {min:0, max:0.3, bands: ["B4", "B3", "B2"]}, '223_082')


//calcula e desenha o ndvi para as duas datas
var ndvi = image.expression("(nir - red)/(nir+red)", {
  nir : image.select("B5"),
  red : image.select("B4")
})
Map.addLayer(ndvi, {min:0, max:1 }, 'ndvi_222-82')

var ndvi2 = image2.expression("(nir - red)/(nir+red)", {
  nir : image2.select("B5"),
  red : image2.select("B4")
})
Map.addLayer(ndvi2, {min:0, max:1 }, 'ndvi_223-82')


