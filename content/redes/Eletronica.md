---
title: "Eletrônica"
date: 2018-03-15T14:03:38-03:00
draft: false
---

O grafo a seguir foi feito a partir dos dados obtidos da API do Spotify
através [desse site](http://labs.polsys.net/playground/spotify/) do labs.polsys e guiado pelo
roteiro disponível nos arquivos HTML [desse repositório](https://github.com/nazareno/intro-d3-redes),
como parte da disciplina de Visualização da Informação, ministrada pelo professor
[Nazareno Andrade](https://github.com/nazareno/).

<div id="chart"></div>

O grafo acima representa os artistas/bandas no Spotify que estão relacionados à
[Vegas](https://pt-br.facebook.com/vegasliveact/about/), nome artístico
de Paulo Vilela Veiga, famoso Dj no cenário nacional de música eletrônica, principalmente
ao observar as subcategorias de música eletrônica mais presente em seus sets:
trance, progressive e psytrance. É importante também notar que no grafo, formou-se
uma clara divisão entre os nós: ao analisar mais cautelosamente, nota-se que essa
divisão foi causada pela diferença entre estilo dos Djs: no grupo onde Vegas está,
predomina mais o trance e o progressive (como Liquid Soul, Astrix, Sesto Sento,
Vini Vici, etc), enquanto no outro grupo, predomina o dance e outros estilos
mais leves de música eletrônica (com Gabe, Alok, Bhaskar, Vintage
  Culture, Selva, KVSH, Jet Lag, etc).

<style>
		.node {
		    fill: #ccc;
		    stroke: #fff;
		    stroke-width: 2px;
		}

		.link {
				stroke: #999;
				stroke-opacity: 0.5;
		}
</style>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script>
		var
		    width = 1000,
		    height = 1000;

		var svg = d3.select("#chart")
				.append("svg")
				.attr('version', '1.1')
				.attr('viewBox', '0 0 '+width+' '+height)
				.attr('width', '100%');

		var color = d3.scaleOrdinal(d3.schemeCategory20);

		var simulation = d3.forceSimulation()
		    .force("link", d3.forceLink().id(function(d) { return d.id; }))
		    .force("charge", d3.forceManyBody().strength(-50))
		    .force("center", d3.forceCenter(width / 2, height / 2))
				.force("collide", d3.forceCollide(8));



		d3.json("vegas.json", function(error, graph) {
		  if (error) throw error;

			g = graph;

			function popularityFilter(popularity) {
				return function(object) {
					return object.size >= popularity;
				}
			}

			function linkPopularity(popularity) {
				return function(object) {
					return getPopularityWithID(object.source) >= popularity && getPopularityWithID(object.target) >= popularity;
				}
			}

			function getPopularityWithID(id) {
				for (i in graph.nodes) {
					if (graph.nodes[i].id == id) {
						return graph.nodes[i].size;
					}
				}
				return -1;
			}

			var selEdges = graph.edges.filter(linkPopularity(40));
			var selNodes = graph.nodes.filter(popularityFilter(40));


			console.dir(graph.edges.length);
			console.dir(graph.nodes.length);

			console.dir(selEdges.length);
			console.dir(selNodes.length);

		  var link = svg.append("g")
		      .attr("class", "link")
		    .selectAll("line")
		    	.data(selEdges)
		    .enter().append("line");

		  var node = svg.append("g")
		      .attr("class", "nodes")
		    .selectAll("circle")
		    	.data(selNodes)
		    .enter().append("circle")
		      .attr("r", function(d) { return d.size/8})
		      .attr("fill", function(d) {
						if (d.id == "5xk7F7RlG0tk0rsGmjFB7z") {
							return d.color;
						}
						return color(d.group) })
		      .call(d3.drag()
		          .on("start", dragstarted)
		          .on("drag", dragged)
		          .on("end", dragended));

		  node.append("title")
		      .text(function(d) { return d.label; });

		  simulation
		      .nodes(selNodes)
		      .on("tick", ticked);

		  simulation.force("link")
		      .links(selEdges);

		  function ticked() {
		    link
		        .attr("x1", function(d) { return d.source.x; })
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });

		    node
		        .attr("cx", function(d) { return d.x; })
		        .attr("cy", function(d) { return d.y; });
		  }
		});

		function dragstarted(d) {
		  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		  d.fx = d.x;
		  d.fy = d.y;
		}

		function dragged(d) {
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}

		function dragended(d) {
		  if (!d3.event.active) simulation.alphaTarget(0);
		  d.fx = null;
		  d.fy = null;
		}

</script>
