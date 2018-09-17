---
title: "O IDH em uma década"
date: 2018-02-27T02:02:39-03:00
draft: false
---

<meta charset="utf-8">
<style>

.cidades {
  fill: none;
  stroke: #fff;
  stroke-linejoin: round;
}

.essevege {
    margin-left:-300px;
}

</style>

<div class="essevege">
<svg width="1000" height="600"></svg>
</div>

O gráfico acima representa a diferença de IDH dos municípios brasileiros entre 2000 e 2010. Os dados foram obtidos através do Observatório do PNE ([nesse link](http://www.observatoriodopne.org.br/downloads)) e os dados de mapa foram obtidos do IBGE. Como demonstrado na legenda, a ideia principal do mapa é evidenciar os municípios brasileiros que mais cresceram, em relação ao seu IDH anterior.

O hover funciona pra saber qual é o município que mais cresceu!

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script src="legenda-d3-cor.js"></script>
<script>

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var path = d3.geoPath();

// a escala de cores
var color = d3.scaleThreshold().domain([0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35]).range(d3.schemeReds[8]);

// função aux definida em legenda-d3-cor.js

ready;
d3.queue()
    .defer(d3.json, "geo4-municipios-e-aprendizado-simplificado.json")
    .await(ready);

function ready(error, dados) {
  if (error) throw error;

  var cidades = dados.features;

  svg.append("g")
      .attr("class", "cidades")
    .selectAll("path")
    .data(cidades)
    .enter()
    .append("path")
      .attr("fill", d => {let valor = d.properties["Crescimento"]; return valor === "NA" ? '#e0e0eb' : color(valor)})
      .attr("d", path)
      .on("mouseover",showTooltip)
      .on("mousemove",moveTooltip)
      .on("mouseout",hideTooltip)
      .append("title")
      .text(d => d.properties.Cidade + ": " + d.properties["Crescimento"])

    desenhaLegenda(0, 0.4, color, "Diferença do IDH entre 2000 e 2010");
}

// ZOOM

//create zoom handler
var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

//specify what to do when zoom event listener is triggered
function zoom_actions(){
 d3.selectAll("path").attr("transform", d3.event.transform);
}

//add zoom behaviour to the svg element
//same as svg.call(zoom_handler);
zoom_handler(svg);


// TOOLTIP

//Create a tooltip, hidden at the start
var tooltip = d3.select("body").append("div").attr("class","tooltip");
//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

function showTooltip(d) {
  moveTooltip();

  tooltip.style("display","block")
      .text(d.properties.Cidade + ": " + d.properties["Crescimento"] + "pts");
}

//Move the tooltip to track the mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  tooltip.style("display","none");
}

</script>