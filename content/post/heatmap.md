---
title: "Mapa de calor em espiral"
date: 2017-12-11T00:21:11-02:00
draft: false
---

<meta charset="utf-8">
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v0.3.min.js"></script>
<link href="https://fonts.googleapis.com/css?family=Catamaran" rel="stylesheet">

<style>
    body {
        font-family: 'Catamaran', sans-serif;
        top: 20px;
        right: 20px;
        bottom: 20px;
        left: 20px;
    }

    line {
        stroke: lightgray;
    }

    .year-label {
        fill: white;
    }

    .tooltip {
      position: absolute;
      text-align: center;
      width: 60px;
      height: 20px;
      padding-top: 3px;
      margin-top: -20px;
      font: 10px sans-serif;
      background: #ddd;
      pointer-events: none;
      border-radius: 5px;
    }

</style>
<body>
<p>Um mapa de calor em espiral demonstrando a quantidade de pedestres + ciclistas no Açude Velho, das 6:00 as 21:00</p>
<div id="chart"></div>
<div id="legend"></div>

<script>

    maxPessoas = (data) => {
        let max = parseInt(data[0].pessoas);
        for (let i = 0; i < data.length; i++) {
            let pessoa = parseInt(data[i].pessoas);
            if (pessoa > max) {
                max = pessoa;
            }
        }
        return max;
    }

    minPessoas = (data) => {
        let max = parseInt(data[0].pessoas);
        for (let i = 0; i < data.length; i++) {
            let pessoa = parseInt(data[i].pessoas);
            if (pessoa < max) {
                max = pessoa;
            }
        }
        return max;
    }

    const radians = 0.0174532925;

    //CHART CONSTANTS
    const chartRadius = 250;
    const chartWidth = chartRadius * 2;
    const chartHeight = chartRadius * 2;
    const labelRadius = chartRadius + 5;
    const margin = { "top": 40, "bottom": 40, "left": 40, "right": 40 };
    const hours = ["+0:00", '+0:15', '+0:30', '+0:45', '+1:00', '+1:15', '+1:30', '+1:45', '+2:00', '+2:15', '+2:30', '+2:45', '+3:00', '+3:15', '+3:30', '+3:45', '+4:00', '+4:15', '+4:30', '+4:45'];

    //CHART OPTIONS
    const holeRadiusProportion = 0.3; //fraction of chartRadius. 0 gives you some pointy arcs in the centre.
    const holeRadius = holeRadiusProportion * chartRadius;
    const segmentsPerCoil = hours.length; //number of coils. for this example, I have 12 hours per year. But you change to whatever suits your data.
    const segmentAngle = 360 / segmentsPerCoil;
    var coils; //number of coils, based on data.length / segmentsPerCoil
    var coilWidth; //remaining chartRadius (after holeRadius removed), divided by coils + 1. I add 1 as the end of the coil moves out by 1 each time

    //SCALES
    var colour = d3.scaleSequential(d3.interpolatePlasma);

    //CREATE SVG AND A G PLACED IN THE CENTRE OF THE SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom);

    const g = svg.append("g")
        .attr("transform", "translate("
        + (margin.left + chartRadius)
        + ","
        + (margin.top + chartRadius) + ")");

    //LOAD THE DATA
    d3.csv("data.csv", convertTextToNumbers, function (error, data) {
        if (error) { throw error; };

            //ENSURE THE DATA IS SORTED CORRECTLY, IN THIS CASE BY YEAR AND MONTH
            //THE SPIRAL WILL START IN THE MIDDLE AND WORK OUTWARDS
            data.sort(function (a, b) {
            return a.hora - b.hora || a.minuto - b.minuto;
        });

        var dataLength = data.length;
        coils = Math.ceil(dataLength / segmentsPerCoil);
        coilWidth = (chartRadius * (1 - holeRadiusProportion)) / (coils + 1);
        var dataExtent = [maxPessoas(data), minPessoas(data)];
        colour.domain(dataExtent);

            //ADD LABELS AND GRIDS FOR EACH MONTH FIRST
            //SO THE GRID LINES APPEAR BEHIND THE SPIRAL
        var monthLabels = g.selectAll(".month-label")
            .data(hours)
            .enter()
            .append("g")
            .attr("class", "month-label");

        monthLabels.append("text")
            .text(function (d) { return d; })
            .attr("x", function (d, i) {
                let labelAngle = (i * segmentAngle) + (segmentAngle / 2);
                return x(labelAngle, labelRadius);
            })
            .attr("y", function (d, i) {
                let labelAngle = (i * segmentAngle) + (segmentAngle / 2);
                return y(labelAngle, labelRadius);
            })
            .style("text-anchor", function (d, i) {
                return i < (hours.length / 2) ? "start" : "end";
            });

        monthLabels.append("line")
            .attr("x2", function (d, i) {
                let lineAngle = (i * segmentAngle);
                let lineRadius = chartRadius + 10;
                return x(lineAngle, lineRadius);
            })
            .attr("y2", function (d, i) {
                let lineAngle = (i * segmentAngle);
                let lineRadius = chartRadius + 10;
                return y(lineAngle, lineRadius);
            });


        //ASSUMING DATA IS SORTED, CALCULATE EACH DATA POINT'S SEGMENT VERTICES
        data.forEach(function (d, i) {

            let coil = Math.floor(i / segmentsPerCoil);
            let position = i - (coil * segmentsPerCoil);

            let startAngle = position * segmentAngle;
            let endAngle = (position + 1) * segmentAngle;

            let startInnerRadius = holeRadius + ((i / segmentsPerCoil) * coilWidth)
            let startOuterRadius = holeRadius + ((i / segmentsPerCoil) * coilWidth) + coilWidth;
            let endInnerRadius = holeRadius + (((i + 1) / segmentsPerCoil) * coilWidth)
            let endOuterRadius = holeRadius + (((i + 1) / segmentsPerCoil) * coilWidth) + coilWidth;

            //vertices of each segment
            d.x1 = x(startAngle, startInnerRadius);
            d.y1 = y(startAngle, startInnerRadius);

            d.x2 = x(endAngle, endInnerRadius);
            d.y2 = y(endAngle, endInnerRadius);

            d.x3 = x(endAngle, endOuterRadius);
            d.y3 = y(endAngle, endOuterRadius);

            d.x4 = x(startAngle, startOuterRadius);
            d.y4 = y(startAngle, startOuterRadius);

            //CURVE CONTROL POINTS
            let midAngle = startAngle + (segmentAngle / 2)
            let midInnerRadius = holeRadius + (((i + 0.5) / segmentsPerCoil) * coilWidth)
            let midOuterRadius = holeRadius + (((i + 0.5) / segmentsPerCoil) * coilWidth) + coilWidth;

            //MID POINTS, WHERE THE CURVE WILL PASS THRU
            d.mid1x = x(midAngle, midInnerRadius);
            d.mid1y = y(midAngle, midInnerRadius);

            d.mid2x = x(midAngle, midOuterRadius);
            d.mid2y = y(midAngle, midOuterRadius);

            //FROM https://stackoverflow.com/questions/5634460/quadratic-b%C3%A9zier-curve-calculate-points
            d.controlPoint1x = (d.mid1x - (0.25 * d.x1) - (0.25 * d.x2)) / 0.5;
            d.controlPoint1y = (d.mid1y - (0.25 * d.y1) - (0.25 * d.y2)) / 0.5;

            d.controlPoint2x = (d.mid2x - (0.25 * d.x3) - (0.25 * d.x4)) / 0.5;
            d.controlPoint2y = (d.mid2y - (0.25 * d.y3) - (0.25 * d.y4)) / 0.5;

        });

        var arcs = g.selectAll(".arc")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "arc")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .on("click", clicked);

        var div2 = d3.select("body").append("div")
            .attr("class", "measure")
            .style("display", "none")


        var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("display", "none");

        function mouseover(d) {
          div.style("display", "inline");
        }

        function mousemove(d) {
          div
            .text(d.pessoas + " pessoas")
            .style("left", (d3.event.pageX - 34) + "px")
            .style("top", (d3.event.pageY - 12) + "px");
        }

        function mouseout(d) {
          div.style("display", "none");
        }

        function clicked(d) {
          div2.style("display", "block");
          
        }

        //CURVED EDGES
        arcs.append("path")
            .attr("d", function (d) {
                //start at vertice 1
                let start = "M " + d.x1 + " " + d.y1;
                //inner curve to vertice 2
                let side1 = " Q " + d.controlPoint1x + " " + d.controlPoint1y + " " + d.x2 + " " + d.y2;
                //straight line to vertice 3
                let side2 = "L " + d.x3 + " " + d.y3;
                //outer curve vertice 4
                let side3 = " Q " + d.controlPoint2x + " " + d.controlPoint2y + " " + d.x4 + " " + d.y4;
                //combine into string, with closure (Z) to vertice 1
                return start + " " + side1 + " " + side2 + " " + side3 + " Z"
            })
            .style("fill", function (d) { return colour(d.pessoas); })
            .style("stroke", "white")

        var yearLabels = arcs.filter(function (d) {
            return ((d.hora == 06 && d.minuto == 00) || (d.hora == 11 && d.minuto == 00) || (d.hora == 16 && d.minuto == 00));
            }).raise();

        yearLabels.append("path")
            .attr("id", function (d) { return "path-" + d.horario; })
            .attr("d", function (d) {
                //start at vertice 1
                let start = "M " + d.x1 + " " + d.y1;
                //inner curve to vertice 2
                let side1 = " Q " + d.controlPoint1x + " " + d.controlPoint1y + " " + d.x2 + " " + d.y2;
                return start + side1;
            })
            .style("fill", "none")
        //.style("opacity", 0);

        yearLabels.append("text")
            .attr("class", "year-label")
            .attr("x", 3)
            .attr("dy", -5)
            .append("textPath")
            .attr("xlink:href", function (d) {
                return "#path-" + d.horario;
            })
            .text(function (d) { return d.horario; })

        //DRAW PEOPLE-BIKES

        const pbikesHeight = chartRadius;
        const pbikesWidth = 20;
        const pbikesPadding = 40;

        let pbikesSVG = d3.select("#pessoas-bicicletas")
          .append("svg")
          .attr("width", pbikesWidth + 2*pbikesPadding)
          .attr("height", pbikesHeight + 2*pbikesHeight);

        pbikesSVG.enter()
          .append("rect")
          .attr("x", d => d)
          .attr("y", d => d)
          .attr("width", pbikesWidth)
          .attr("height", pbikesHeight)
          .attr("fill", "darkblue")

        //DRAW LEGEND

        const legendWidth = chartRadius;
        const legendHeight = 20;
        const legendPadding = 40;

        var legendSVG = d3.select("#legend")
            .append("svg")
            .attr("width", legendWidth + legendPadding + legendPadding)
            .attr("height", legendHeight + legendPadding + legendPadding);

        var defs = legendSVG.append("defs");

        var legendGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        let noOfSamples = 20;
        let dataRange = dataExtent[1] - dataExtent[0];
        let stepSize = dataRange / noOfSamples;

        for (i = 0; i < noOfSamples; i++) {
            legendGradient.append("stop")
                .attr("offset", (i / (noOfSamples - 1)))
                .attr("stop-color", colour(dataExtent[0] + (i * stepSize)));
        }

        var legendG = legendSVG.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(" + legendPadding + "," + legendPadding + ")");

        legendG.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#linear-gradient)");

        legendG.append("text")
            .text("Mais Pessoas")
            .attr("x", 0)
            .attr("y", legendHeight - 35)
            .style("font-size", "12px");

        legendG.append("text")
            .text("Menos Pessoas")
            .attr("x", legendWidth)
            .attr("y", legendHeight - 35)
            .style("text-anchor", "end")
            .style("font-size", "12px");

    });

    function x(angle, radius) {
        //change to clockwise
        let a = 360 - angle;
        //start from 12 o'clock
        a = a + 180;
        return radius * Math.sin(a * radians);
    };

    function y(angle, radius) {
        //change to clockwise
        let a = 360 - angle;
        //start from 12 o'clock
        a = a + 180;
        return radius * Math.cos(a * radians);
    };

    function convertTextToNumbers(d) {
        d.pessoas = +d.pessoas
        d.hora = +(d.horario[0] + d.horario[1])
        d.minuto = +(d.horario[3] + d.horario[4])
        return d;
    };

</script>

<p>
  O mapa de calor em espiral mostra, a partir de seu centro, a quantidade de
  pessoas que esteve no açude a pé ou com bicicleta, em intervalos de 15 minutos.
  A posição do intervalo define qual é o horário em que a quantidade foi medida,
  partindo das 6:00 e encerrando as 21:00. A quantidade de pessoas pode ser vista
  pela cor, e o horário pela posição.
</p>
</body>
