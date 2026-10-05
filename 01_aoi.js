//GEE short course
//Eliana Lima da Fonseca
//Universidade Federal do Rio Grande do Sul

// 1. Fazer uma lista dos estados do Brasil (Nível 1 - ADM1)
var level_1 = ee.FeatureCollection("FAO/GAUL/2015/level1");
var brazil_states = level_1.filter(ee.Filter.eq('ADM0_NAME', 'Brazil'));

// Extrair e imprimir a lista de estados no Console
var state_names = brazil_states.aggregate_array('ADM1_NAME');
print('Estados do Brasil:', state_names);

// 2. Fazer uma lista dos municípios do RS (Nível 2 - ADM2)
var level_2 = ee.FeatureCollection("FAO/GAUL/2015/level2");
var rs_municipalities = level_2.filter(ee.Filter.and(
  ee.Filter.eq('ADM0_NAME', 'Brazil'),
  ee.Filter.eq('ADM1_NAME', 'Rio Grande Do Sul')
));

// Extrair e imprimir a lista de municípios do RS no Console
var mun_names = rs_municipalities.aggregate_array('ADM2_NAME');
print('Municípios do Rio Grande do Sul:', mun_names);

// 3. Selecionar apenas Bagé
// Nota: Na base GAUL, os nomes geralmente não possuem acentuação.
var bage = rs_municipalities.filter(ee.Filter.eq('ADM2_NAME', 'Bage'));

// 4. Fazer o zoom em Bagé
// O Map.centerObject centraliza e ajusta o zoom automaticamente para a feição (o número 10 é o nível de zoom)
Map.centerObject(bage, 8); 
Map.setOptions('satellite');

// 5. Desenhar Bagé
Map.addLayer(bage, {color: 'white'}, 'Bagé');

//5.1.Desenha o contorno da área de interesse (AOI)

var AOI = bage
var empty = ee.Image().byte();

var outline = empty.paint({
  featureCollection: AOI,
  color: 1,
  width: 1});
Map.addLayer(outline, {palette: 'FF0000'}, 'AOI');

// 6. No rótulo escrever Bagé - RS
var title = ui.Label('Bagé - RS');
title.style().set({
  position: 'top-center',
  fontSize: '20px',
  fontWeight: 'bold'
});
Map.add(title);
