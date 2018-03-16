---
title: "Historia"
date: 2017-11-16T00:39:51-02:00
draft: false
---

Um dia, após o almoço, Edilson e sua família foram assistir ao Jornal da Paraíba. Em uma das manchetes, já havia sido avisado que iriam noticiar sobre
a seca no açude Epitácio Pessoa, que abastece a cidade de Campina Grande. Ao ver que o racionamento havia terminado, com a chegada da água da 
transposição do rio São Francisco à cidade de Campina Grande, ficou preocupado se o açude iria ou não voltar a encher, por causa do elevado consumo.
No jornal, mostraram um gráfico (Visualização 1), indicando os aumentos e quedas no volume de água, e relacionando a seca ao fenômeno meteorológico
"El Niño". Ao fim da matéria, a repórter agradeceu ao Instituto Nacional do Semiárido(INSA), pela coleta e estudo dos dados ao longo dos anos.
Edilson então resolver busca esses dados no site do INSA, mas como não sabia fazer projeções de dados além das permitidas pelo Excel, pediu ajuda
ao seu filho, Júlio, para analisar os dados que ali estavam, dizendo que queria observar como o volume de água variou durante os anos. Júlio, que sabia
um pouco de programação, resolveu criar um 
[pequeno programa para ajudar a analisar a variação](https://gist.github.com/juliobguedes/0f421672acebc2c2b0fca28c7f681257) do volume ao longo dos anos 
de acordo com os dados do INSA, obtendo um gráfico bastante interessante (Visualização 2). Edilson achou bastante interessante, lembrando de
[notícias antigas sobre as secas ao longo dos anos](http://www.ceped.ufsc.br/historico-de-secas-no-nordeste-do-brasil/), como mostrava a visualização 
feita por Júlio, em especial as secas da década de 90, que geraram uma enorme variação no volume do açude:

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
    },"transform": [
      {"filter": {"field": "DataInformacao", "range": [{"year": 1990, "month": "jan", "date": 1}, {"year": 2000, "month": "jan", "date": 1}] }}
  ],"mark":"bar",
    "encoding": {
        "x":{"field":"DataInformacao", "type": "temporal", "timeUnit":"yearmonth", "axis":{"title":"Variação média do volume por mês do ano"}},
        "y":{"field":"Variacao", "type": "quantitative", "aggregate":"average", "axis":{"title":"Variação do Volume"}}
    },
    "width": 480,
    "height": 300
}
  	vegaEmbed('#vis', spec).catch(console.warn);
</script>

Resolveu então voltar ao trabalho, mas o assunto não saiu de sua cabeça. Como bom agrônomo que é, ficou pensando em como, além dos grandes fenômenos
climáticos, a passagem dos meses e a variação das estações fez variar o volume de água no açude, para melhor adaptar a plantação de mudas que fazia no 
trabalho. Chegando em casa, esperou Júlio chegar da Universidade e pediu para que fizesse um outro gráfico, mostrando essa informação. Júlio então adaptou seu programa anterior para mostrar os dados que seu pai pediu, e pôde ver (visualização 3) que há um grande aumento no volume d'água de janeiro
a abril, havendo uma crescente queda de maio a setembro que se atenua de outubro a dezembro.