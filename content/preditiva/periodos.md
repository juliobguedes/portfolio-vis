---
title: "Períodos de Gastos - Parte 1: Processamento inicial"
date: 2018-09-11T21:53:48-03:00
draft: false
---

Analisando os dados de gastos da Cota para Exercício da Atividade Parlamentar (CEAP), que pode ser encontrada [aqui](http://www2.camara.leg.br/transparencia/cota-para-exercicio-da-atividade-parlamentar/dados-abertos-cota-parlamentar), pudemos construir um conjunto de dados com os gastos de 2014 a 2017 que pode ser encontrado [neste link](https://canvas.instructure.com/courses/1402758/files/67618888/download?verifier=ibyou5PYo9aaFgRaefc0keYkHhkQ2EqIArdmI1bq&wrap=1). 

A partir desse conjunto de dados, podemos fazer uma análise exploratória sobre os mesmos, de modo a extrair informações sobre os dados. Assim, a primeira pergunta que fiz sobre os dados foi: **em que período(s) do ano os Parlamentares mais gastam através da CEAP?**

Essa pergunta pode ser respondida através de algumas manipulações nos dados. Em R, usando um conjunto de pacotes que ajudam a manipular os dados, inicialmente carregamos o conjunto de dados e os pacotes necessários. Além disso, editamos a coluna `valorGlosa` para corrigir o padrão de ponto flutuante brasileiro (que usa ,) para o padrão de ponto flutuante internacional e também retiramos as entradas com valor negativo, que foram ressarcimentos de gastos já presentes anteriormente nos dados. Vejamos:

```r
# Carregando as bibliotecas
library(tidyverse)
library(plyr)
library(ggrepel)
library(gridExtra)
library(plotly)
library(scales)

# Carregando os dados
dadosCEAP <- read_csv("dadosCEAP.csv")
dadosCEAP$valorGlosa <- as.numeric(sub(",", ".", dadosCEAP$valorGlosa, fixed = TRUE))
dadosCEAP <- subset(dadosCEAP, valorLíquido >= 0)
```

Tendo os dados agora carregados, precisamos manipulá-los para conseguir extrair a informação que desejamos. Dessa forma, o dataframe que buscamos é um que tenha uma entrada para a soma de todos os gastos de um tipo de despesa em cada dia do ano. Para obter esse resultado, podemos fazer as seguintes manipulações:

1. Do dataframe original, `dadosCEAP`, transformamos a coluna `dataEmissao` em de modo a não importar o ano em que o gasto foi feito;
2. Em seguida, cria-se um novo conjunto de dados agrupando o valor para cada dia e tipo de despesa.

```r
gastosAno <- aggregate(valorLíquido ~ dataEmissao + tipoDespesa, dadosCEAP, sum)
gastosAno$dataEmissao <- format(as.Date(gastosAno$dataEmissao), format="%d/%m")
gastosAno$valorLiq <- gastosAno$valorLíquido
gastosAno <- subset(gastosAno, select=c("dataEmissao", "tipoDespesa", "valorLiq"))
write.csv(gastosAno, file="gastosAno.csv", row.names = FALSE)
```

A partir de agora, temos uma tabela no formato `dataEmissao | tipoDespesa | valorLiq`, mas ainda temos mais de uma entrada para cada data, já que são diferentes tipos de despesa. O objetivo, então, é fazer essa manipulação já no javascript, pelo simples fato de que manipulação de objetos json em R é inviável. Assim, ao carregarmos o conjunto de dados, teremos objetos como:

```json
[{ "dataEmissao": "01/01", "tipoDespesa": "Emissão Bilhete Aéreo", "valorLiq": 104.25 },
{ "dataEmissao": "01/01", "tipoDespesa": "ASSINATURA DE PUBLICAÇÕES", "valorLiq": 68.4 }]
```

É nosso objetivo transformar os dados para que fiquem no seguinte formato:

```json
{
    "dataEmissao": "01/01",
    "despesas": [
        {
            "tipoDespesa": "Emissão Bilhete Aéreo",
            "valorLiq": 104.25
        }, {
            "tipoDespesa": "ASSINATURA DE PUBLICAÇÕES",
            "valorLiq": 68.4
        }
    ],
    "valorTotal": 172.65
}
```

Veremos a transformação, em Python e Javascript, na próxima parte :)