const width = 620;
const height = 420;
const margin = { top: 40, bottom: 40, left: 40, right: 40 };
const innerRadius = 100;
const outerRadius = Math.min(width, height) / 2 - 6;
const fullCircle = 2 * Math.PI;

const timeParser = d3.timeParse('%d/%m');
const monthFormat = d3.timeFormat('%b');

const x = d3.scaleTime().range([0, fullCircle]);
const y = d3.scaleRadial().range([innerRadius, outerRadius]);

const line = d3.lineRadial()
    .angle((d) => x(d.dataEmissao))
    .radius((d) => y(d.valorTotal));

const svg = d3.select("#root")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

const g = svg.append("g")
    .attr("class", "key")
    .attr("transform", `translate(${width/2},${height/2})`);

const formatMoney = (money) => money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

const setUp = (data) => {
    const group = {};
    data.map(element => {
        element.valorLiq = Math.round(+element.valorLiq);
        const currentDate = group[element.dataEmissao];
        if (currentDate) {
            const hasElement = currentDate.despesas.filter(cur => {
                return cur.tipoDespesa === element.tipoDespesa;
            });
            if (hasElement.length > 0) {
                hasElement[0].valorLiq += element.valorLiq;
            } else {
                currentDate.despesas.push({
                    tipoDespesa: element.tipoDespesa,
                    valorLiq: +element.valorLiq
                });

            }
            currentDate.valorTotal += +element.valorLiq;
        } else {
            const newElement = {
                dataEmissao: timeParser(element.dataEmissao),
                despesas: [{ tipoDespesa: element.tipoDespesa, valorLiq: +element.valorLiq }],
                valorTotal: +element.valorLiq,
            };
            group[element.dataEmissao] = newElement;
        }
    });

    return Object.keys(group).map(key => group[key]).sort((a,b) => {
        if (a.dataEmissao === b.dataEmissao) return 0;
        if (a.dataEmissao < b.dataEmissao) return -1;
        return 1;
    });
};

const ready = (error, dados) => {
    if (error) throw error;
    const finalData = setUp(dados);
    console.log(finalData);
    
    x.domain(d3.extent(finalData, (d, i) => d.dataEmissao));
    y.domain(d3.extent(finalData, (d, i) => d.valorTotal));

    const linePlot = g.append("path")
        .datum(finalData)
        .attr("fill", "none")
        .attr("stroke", "#00a86b")
        .attr("d", line);

    const yAxis = g.append("g")
        .attr("text-anchor", "middle")

    const yTick = yAxis
        .selectAll("g")
        .data(y.ticks(4))
        .enter().append("g");

    yTick.append("circle")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("opacity", 0.2)
        .attr("r", y);

    yAxis.append("circle")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("opacity", 0.2)
        .attr("r", () => y(y.domain()[0]));

    yTick.append("text")
        .attr("y", function(d) { return -y(d); })
        .attr("dy", "-0.30em")
        .attr("font-size", "12px")
        .text(function(d) { return "R$" + formatMoney(d); });

    const xAxis = g.append("g");

    const xTick = xAxis
        .selectAll("g")
        .data(x.ticks(12))
        .enter().append("g")
            .attr("text-anchor", "middle")
            .attr("transform", (d) => `rotate(${((x(d)) * 180 / Math.PI - 90)})translate(${innerRadius}, 0)`);

    xTick.append("line")
        .attr("x2", -5)
        .attr("stroke", "#000");

    xTick.append("text")
        .attr("transform", function(d) { 
        var angle = x(d);
        return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)"; })
        .text(function(d) { 
          return monthFormat(d);
        })
      	.style("font-size", 10)
        .attr("opacity", 0.6);
        
    var title = g.append("g")
        .attr("class", "title")
        .append("text")
        .attr("dy", "-0.2em")
        .attr("text-anchor", "middle")
        .text("Gastos CEAP")

    var subtitle = g.append("text")
            .attr("dy", "1em")
        .attr("text-anchor", "middle")
            .attr("opacity", 0.6)
            .text("14-17");  
        
    var lineLength = linePlot.node().getTotalLength();

    linePlot
        .attr("stroke-dasharray", lineLength + " " + lineLength)
        .attr("stroke-dashoffset", lineLength)
        .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

};

d3.queue()
    .defer(d3.csv, "gastosAno.csv")
    .await(ready);
