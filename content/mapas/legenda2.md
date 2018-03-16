---
title: "Salário Mínimo"
date: 2018-02-20T02:29:11-03:00
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
    .domain([0, 500])
    .rangeRound([0, 360]);

var color = d3.scaleThreshold().domain([75, 150, 225, 300, 375, 450]).range(d3.schemeYlOrRd[7]);

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
    .text("Quantidade de responsáveis com salário igual ou menor que dois salários mínimos");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return x; })
    .tickValues(color.domain()))
  .select(".domain")
    .remove();
</script>

<img src="choropleth-renda.svg"/>

A visualização acima mostra, com base nos dados do censo do IBGE feito em 2010 (que podem ser conferidos [neste link](https://mapas.ibge.gov.br/bases-e-referenciais/bases-cartograficas/malhas-digitais.html) e que pode ser melhor entendido [aqui](https://analiticaterritorial.wordpress.com/2016/04/19/ibge-entenda-a-diferenca-entre-censo-demografico-e-pnad/) ), os municípios e regiões com maior quantidade de responsáveis que recebem dois ou menos salários mínimos. Pela saturação e brilho da cor, pode-se notar que, de acordo com a escala e o mapa, a maior parte das regiões de nosso estado tem menos de 300 responsáveis recebendo salários nessa faixa; entretanto, ainda é preocupante o suficiente que tenhamos algumas cidades no extremo oposto, onde em torno de 375 responsáveis estão recebendo salários nessa faixa.