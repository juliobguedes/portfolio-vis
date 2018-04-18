---
title: "Alfabetizados"
date: 2018-02-19T21:23:56-03:00
draft: false
---

<meta charset="utf-8">

<style>
    .jus {
        text-align: justify;
    }
</style>

<svg width="400" height="100"></svg>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-interpolate.v1.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script>

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var x = d3.scaleLinear()
    .domain([0, 280])
    .rangeRound([0, 360]);

var color = d3.scaleThreshold().domain([35,70,105,140,175,210,245]).range(d3.schemeYlGn[8]);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Quantidade de pessoas alfabetizadas com idade entre 7 e 19 anos");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return x; })
    .tickValues(color.domain()))
  .select(".domain")
    .remove();
</script>

<img src="choropleth-alfabetizacao.svg"/>

A visualização acima mostra, com base nos dados do censo do IBGE feito em 2010 (que podem ser conferidos [neste link](https://mapas.ibge.gov.br/bases-e-referenciais/bases-cartograficas/malhas-digitais.html) e que pode ser melhor entendido [aqui](https://analiticaterritorial.wordpress.com/2016/04/19/ibge-entenda-a-diferenca-entre-censo-demografico-e-pnad/) ), a quantidade de crianças e adolescentes alfabetizados nos municípios e regiões paraibanos. É extremamente preocupante que a maior parte do mapa esteja preenchida com cores claras, demonstrando o enorme trabalho que ainda deve ser feito quanto a educação das crianças no nosso país.