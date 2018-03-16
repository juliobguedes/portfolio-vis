---
title: "Segunda Visualização"
date: 2017-11-16T00:08:14-02:00
draft: false
---

Variação média do volume por mês do ano, entre 1990 e 2000

<div id="vis" width=300></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vega/3.0.7/vega.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/2.0.1/vega-lite.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/3.0.0-rc7/vega-embed.js"></script>
<script>
    const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "data": {
        "url":"https://gist.githubusercontent.com/juliobguedes/e9d5820ec7c2a68bb5cc24f6bde796b0/raw/417bb98981812899469848caa3fcffef8161592b/dados.json",
        "format": {
            "type": "json",
            "property": "dados",
            "parse": {
                "DataInformacao": "utc:'%d/%m/%Y'"
            }
        }
    },"mark":"bar",
    "encoding": {
        "x":{"field":"DataInformacao", "type": "temporal", "timeUnit":"yearmonth", "axis":{"title":"Variação média do volume por mês do ano"}},
        "y":{"field":"Variacao", "type": "quantitative", "aggregate":"average", "axis":{"title":"Variação do Volume"}}
    },
    "width": 480,
    "height": 300
}
  	vegaEmbed('#vis', spec).catch(console.warn);
</script>