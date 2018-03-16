---
title: "Primeira Visualização"
date: 2017-11-15T17:07:51-02:00
draft: false
---

<div id="vis" width=300></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vega/3.0.7/vega.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/2.0.1/vega-lite.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/3.0.0-rc7/vega-embed.js"></script>
<script>
    const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "data": {
        "url":"https://api.insa.gov.br/reservatorios/12172/monitoramento",
        "format": {
            "type": "json",
            "property": "volumes",
            "parse": {
                "DataInformacao": "utc:'%d/%m/%Y'"
            }
        }
    }, "mark":"line",
    "encoding": {
        "x":{
            "field":"DataInformacao",
            "type": "temporal",
            "timeUnit":"year",
            "axis":{
                "title":"Volume médio ao longo dos anos"
            }
        },
        "y":{
            "field":"Volume",
            "aggregate":"average",
            "type": "quantitative",
            "axis":{
                "title":"Volume"
            }
        }
    },
    "width": 480,
    "height": 300
}
  	vegaEmbed('#vis', spec).catch(console.warn);
</script>

A visualização representa a variação do volume de água durante os anos, desde o início dos registros.