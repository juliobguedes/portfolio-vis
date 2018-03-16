---
title: "Lab 2 - Parte 2"
date: 2017-11-29T13:44:40-03:00
draft: false
---
<script src="https://d3js.org/d3.v4.min.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<div class="mychart" id="chart"></div>

<style>

  .mychart text {
    font: 12px sans-serif;
    text-anchor: left;
  }
</style>

<script type="text/javascript">
"use strict"

function desenhaBarras(dados) {
  var alturaSVG = 400, larguraSVG = 700;
  var	margin = {top: 10, right: 20, bottom:30, left: 45}, // para descolar a vis das bordas do grafico
      larguraVis = larguraSVG - margin.left - margin.right,
      alturaVis = alturaSVG - margin.top - margin.bottom;

  var grafico = d3.select('#chart') // cria elemento <svg> com um <g> dentro
    .append('svg')
      .attr('width', larguraVis + margin.left + margin.right)
      .attr('height', alturaVis + margin.top + margin.bottom)
    .append('g') // para entender o <g> vá em x03-detalhes-svg.html
      .attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')');

  let buscaMaxDez = () => {
    let maior = 0;
    for (let index = 0; index < dados.length; index++) {
      let atual = dados[index].dez_percentil;
      if (atual > maior) {
        maior = atual;
      }
    }console.log(maior);
    return maior;

  }

  let buscaMaxNoventa = () => {
    let maior = 0;
    for (let index = 0; index < dados.length; index++) {
      let atual = dados[index].noventa_percentil;
      if (atual > maior) {
        maior = atual;
      }
    }
    return maior;
  }

  let reposicionaEmX = (valor) => {
    return (valor * larguraVis)/buscaMaxNoventa();
  }

  let reposicionaEmY = (valor) => {
    return alturaVis - (valor * alturaVis)/buscaMaxDez();
  }

  let minMediana = () => {
    let menor = dados[0].mediana;
    for (let index = 0; index < dados.length; index++) {
      let atual = dados[index].mediana;
      if (atual < menor) {
        menor = atual;
      }
    }
    return menor;
  }

  let maxMediana = () => {
    let maior = 0;
    for (let index = 0; index < dados.length; index++) {
      let atual = dados[index].mediana;
      if (atual > maior) {
        maior = atual;
      }
    }
    return maior;
  }

  let preenchimento = d3.scaleLinear()
    .domain([minMediana(), maxMediana()])
    .range(["#4169E1","#ADD8E6"])
    .clamp("true");


  var x = d3.scaleLinear()
    .domain([0,buscaMaxNoventa()])
    .range([0, larguraVis]); // Configure essa escala com domain, range e padding

  var y = d3.scaleLinear()
    .domain([0, buscaMaxDez()])
    .range([alturaVis,0]) // Configure essa escala com domain e range
                           // Lembre que uma escala pode converter de 1..10 -> 100..1
  // === ATÉ DAQUI ===

  grafico.selectAll('g')
          .data(dados)
          .enter()
            .append('circle')
              .attr('cx', d => reposicionaEmX(d.noventa_percentil))   // usando a escala definida acima
              .attr('cy', d => reposicionaEmY(d.dez_percentil))
              .attr('fill', d => preenchimento(d.mediana))
              .attr('r', 3);

  grafico.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + alturaVis + ")")
          .call(d3.axisBottom(x)); // magica do d3: gera eixo a partir da escala

  grafico.append('g')
          .attr('transform', 'translate(0,0)')
          .call(d3.axisLeft(y))  // gera eixo a partir da escala

  grafico.append("text")
    .attr("transform", "translate(-30," + (alturaVis + margin.top)/2 + ") rotate(-90)")
    .text("10-percentil");
}

d3.json('boqueirao-por-mes.json', function(dados) {
  console.log("provavelmente acontece depois")
  desenhaBarras(dados);
});

console.log("provavelmente acontece primeiro") // me apague quando entender.

</script>
