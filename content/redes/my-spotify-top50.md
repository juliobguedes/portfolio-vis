---
title: "My Spotify Top50"
date: 2018-03-15T20:12:25-03:00
draft: false
---
<head>
    <title>Directive by HTML5 UP</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
    <!-- <link rel="stylesheet" href="css/main.css" /> -->
    <!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
    <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>
    <link rel="stylesheet" href="style.css">
</head>

<body>

<!-- <script src="js/jquery.min.js"></script> -->
<!-- <script src="js/skel.min.js"></script> -->
<!-- <script src="js/util.js"></script> -->
<!--[if lte IE 8]><script src="js/ie/respond.min.js"></script><![endif]-->
<!-- <script src="js/main.js"></script> -->
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.24.0/d3-legend.js"></script>

<svg width="730" height="630">
    <defs>
        <filter id="greyscale">
            <feColorMatrix
                    type="matrix"
                    values="0 1 0 0 0
        0 1 0 0 0
        0 1 0 0 0
        0 1 0 1 0 ">
            </feColorMatrix>
        </filter>
    </defs>
</svg>

O grafo acima foi feito a partir dos dados da minha conta no Spotify, através da API pública do mesmo.
Através da visualização, pode-se observar que nos meus artistas mais ouvidos, existe uma grande divisão 
entre os seus estilos: no primeiro grande conjunto, é possível observar que os artistas são predominantemente
(se não totalmente) brasileiros, e os estilos dos mesmos se ligam por gêneros musicais também brasileiros; no segundo grande conjunto predominam artistas do pop americano, sendo ligados por estarem em subdivisões do pop;
os menores conjuntos, entretanto, representam a música eletrônica e o indie.

O conjunto foi gerado excluindo-se os genêros com poucos representantes (menos que 3) ou representantes demais, coisa que preveniu que o grafo se tornasse genérico através de estilos mais abrangentes, como o pop. Isso foi feito através do auxílio de um script em python que pode ser visto [nesse link](https://gist.github.com/juliobguedes/f9ad1a31e9dc163007efd9d341952115).

Caso queira reproduzir, crie um fork do [repositório do ss1993](https://github.com/ss1993/my-spotify-top50) e recupere o json da sua conta a partir [desse link pra api do Spotify](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/). Em seguida, rode o script de python, caso queira, altere os limites inferior e superior, mude as referências no arquivo que gera o grafo, no seu fork, para receber como entrada o seu conjunto de nós e arestas gerado pelo script e só partir pro abraço.

<script>
const svg = d3.select('svg'),
    width = +svg.attr('width'),
    height = +svg.attr('height');

const tooltipDiv = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


const color = d3.scaleOrdinal(d3.schemeCategory20);

const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody())
    .force('link', d3.forceLink().id(d => d.id))
    .force('collide', d3.forceCollide(30))
    .force('center', d3.forceCenter((width / 2), height / 2))
    .force('genreX', d3.forceX(genreX).strength(-0.0030))
    .force('genreY', d3.forceY(genreY).strength(0.0030));

svg.append('g')
    .attr('class', 'category-legend')
    .attr('transform', 'translate(20,20)');

const legend = d3.legendColor()
    .shape('circle')
    .shapeRadius('5')
    .orient('vertical')
    .classPrefix('legend');


d3.json('data.json', function (error, graph) {
    console.log(graph);
    if (error) throw error;

    const types = d3.set(graph.edges.map(e => e.type)).values();
    color.domain(types);

    legend
        .scale(color)
        .on('cellover', c => {
            d3.selectAll('.links line')
                .transition().duration(200)
                .attr('opacity', d => d.type === c ? 1 : 0);

            d3.selectAll('.node image')
                .filter(n => {
                   return graph.edges
                       .filter(e => e.type === c)
                       .find(e => e.source.id === n.id || e.target.id === n.id) !== undefined;
                })
                .attr('x', n => -33)
                .attr('y', n => -33)
                .attr('width', 66)
                .attr('height', 66);
        })
        .on('cellout', () => {
            d3.selectAll('.links line')
                .transition().duration(200)
                .attr('opacity', 1);

            d3.selectAll('.node image')
                .attr('x', n => -25)
                .attr('y', n => -25)
                .attr('width', 50)
                .attr('height', 50);
        });

    svg.select('.category-legend')
        .call(legend);

    const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graph.edges)
        .enter()
        .append('line')
        .style('stroke', e => color(e.type))
        .attr('stroke-width', 1)
        .on('mouseover', d => {
            d3.selectAll('.legendlabel')
                .filter(l => l === d.type)
                .classed('legend-hover', true);
        })
        .on('mouseout', () => {
            d3.selectAll('.legendlabel')
                .classed('legend-hover', false);
        });

    const nodeGroup = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('.node')
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    nodeGroup
        .append('image')
        .attr('xlink:href', d => d.img)
        .attr('x', -25)
        .attr('y', -25)
        .attr('width', 50)
        .attr('height', 50)
        .on('mouseover', (d, i, nodes) => {
            svg.selectAll('.links line')
                .transition()
                .duration(200)
                .attr('opacity', e => d.id === e.source.id || d.id === e.target.id ? 1 : 0);

            tooltipDiv.transition()
                .duration(200)
                .style('opacity', 0.7);
            tooltipDiv.html(`${d.name}`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");

            d3.selectAll(nodes)
                .classed('greyed', n => n.id !== d.id && !isAdjacent(d, n))
                .transition().duration(200)
                .attr('x', n => isAdjacent(d, n) ? -33 : -25)
                .attr('y', n => isAdjacent(d, n) ? -33 : -25)
                .attr('width', n => isAdjacent(d, n) ? 66 : 50)
                .attr('height', n => isAdjacent(d, n) ? 66 : 50);

            d3.select(nodes[i])
                .transition()
                .duration(200)
                .attr('x', -40)
                .attr('y', -40)
                .attr('width', 80)
                .attr('height', 80);

            d3.selectAll('.legendlabel')
                .filter(l => {
                    return graph.edges
                        .filter(e => e.source.id === d.id || e.target.id === d.id)
                        .map(e => e.type)
                        .includes(l);
                })
                .classed('legend-hover', true);

        })
        .on('mouseout', (d, i, nodes) => {
            svg.selectAll('.links line')
                .transition()
                .duration(200)
                .attr('opacity', 1)
                .attr('stroke-width', 1)
                .style('stroke', e => color(e.type));

            tooltipDiv.transition()
                .duration(200)
                .style('opacity', 0);

            d3.selectAll(nodes)
                .classed('greyed', false)
                .transition()
                .duration(200)
                .attr('x', -25)
                .attr('y', -25)
                .attr('width', 50)
                .attr('height', 50);

            d3.selectAll('.legendlabel')
                .classed('legend-hover', false);
            const node = d3.selectAll('.node')
                .filter(n => d.id === n.id);

            node.select('rect')
                .remove();

            node.select('text')
                .remove();
        })
        .on('click', d => window.open(d.url));

    simulation
        .nodes(graph.nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(graph.edges);

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d =>  d.target.x)
            .attr('y2', d => d.target.y);

        nodeGroup.attr('transform', d => `translate(${d.x}, ${d.y})`);
    }

    function isAdjacent(source, node) {
        return graph.edges
            .filter(e => e.source.id === source.id || e.target.id === source.id)
            .find(e => e.target.id === node.id || e.source.id === node.id) !== undefined;
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

function genreX(n) {
    const genres = n.genres.join('-');
    if (genres.includes('hip hop') || genres.includes('rap')) {
        return width / 4 * 3;
    } else if (genres.includes('house')) {
        return width / 4;
    } else {
        return width;
    }
}

function genreY(n) {
    const genres = n.genres.join('-');
    if (genres.length === 0 && !genres.includes('hip hop') && !genres.includes('rap') && genres.includes('house')) {
        return height / 4;
    } else {
        return height / 2;
    }
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
</script>


</body>