---
title: "Períodos de Gastos - Parte 2.2: Pré-processamento para a Visualização em Python"
date: 2018-09-17T01:02:22-03:00
draft: false
---

Como dito anteriormente, essa parte do tutorial focará na transformação dos dados usando Python. Diferente de JavaScript, Python não lida com objetos da mesma forma que d3. Assim, usaremos bibliotecas para que os dados sejam exportados no formato correto (JSON). A grande vantagem de fazer essa transformação em Python é tornar o trabalho do cliente menor ao carregar a visualização, por já estar com os dados no formato correto. Assim, nosso código em Python terá três etapas principais: importar, tratar e exportar os dados. Para tratar os dados em Python usaremos dicionários (dict), que em linguagens não funcionais costumam ser chamados de maps. Apenas para lembrar, nossos objetos estão no seguinte formato:

```json
[{ "dataEmissao": "01/01", "tipoDespesa": "Emissão Bilhete Aéreo", "valorLiq": 104.25 },
{ "dataEmissao": "01/01", "tipoDespesa": "ASSINATURA DE PUBLICAÇÕES", "valorLiq": 68.4 }]
```

O nosso objetivo será transformar os dados para que estejam nesse formato:

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

Diferente do que foi feito na parte de JavaScript, ao invés um pseudocódigo que explica o que deve ser feito, a ideia será explicada no próprio código. Isso se deve ao fato de que Python é uma linguagem síncrona, diferentemente de JavaScript. Apesar de Python ter boas relações com o paradigma funcional, nosso código usará uma abordagem imperativa. Vamos a ele:

1. Inicialmente, é necessário importar as bibliotecas auxiliares para importar e exportar os dados:
    ```python
    # coding: utf-8
    # O comentário acima identifica que, durante a manipulação
    # dos dados, trataremos a codificação no padrão
    # UTF-8.
    import json # Biblioteca que será usada para exportar os dados
    ```
2. Particularmente, a biblioteca de manipulação de CSV não me agrada. Por isso, o CSV será importado como um arquivo de texto qualquer, e a manipulação das células será feita à mão.
    ```py
    with open('gastosAno.csv', 'r') as entrada:
        linhas = entrada.readlines() # aqui, a variável entrada
        # passa a guardar uma lista de strings, sendo cada uma
        # das strings relativa à uma linha do CSV. Entretanto, 
        # Existem vírgulas nas strings de células do CSV. assim,
        # substituiremos as vírgulas por ponto-e-vírgula:

        for i in range(len(linhas)):
            linhas[i] = linhas[i].replace('",', '";')
            linhas[i] = linhas[i].split(';')
        # Fazendo essa manipulação, a variável linhas
        # agora guarda o CSV como uma lista de listas,
        # no formato: [['dataEmissao', 'tipoDespesa', 'valorLiq'], ...]
        # e cabe a nós saber o que cada posição da lista representa,
        # e por isso, descartamos a primeira linha,
        # que era apenas o cabeçalho do CSV:

        linhas = linhas[1:]
    ```
3. Diferentemente de JS, ao tentarmos acessar o valor de uma chave inexistente do dicionário, não obtemos `undefined`, e sim um `KeyError`. Assim, ao invés de um `else`, teremos um `except`. A ideia, nesse ponto, é: Criar um dicionário e, para cada linha do CSV, caso a `dataEmissao` já exista como chave desse dicionário, atualizamos o dicionário que guarda como valor. Caso não exista, criamos um objeto no formato do JSON de saída:
    ```py
    finalObj = {}

    for linha in linhas:
        dataEmissao = linha[0][1:-1]
        tipoDespesa = linha[1][1:-1]
        valorLiq = int(float(linha[2]))
        try:
            recuperado = finalObj[dataEmissao]
            jaExiste = [obj for obj in recuperado['despesas'] if obj['tipoDespesa'] == tipoDespesa]
            if (len(jaExiste) > 0):
                jaExiste[0]['valorLiq'] += valorLiq
            else:
                novaDespesa = { 'tipoDespesa': tipoDespesa, 'valorLiq': valorLiq }
                recuperado['despesas'].append(novaDespesa)
            recuperado['valorTotal'] += valorLiq
        except KeyError:
            novaDespesa = { 'tipoDespesa': tipoDespesa, 'valorLiq': valorLiq }
            novaData = { 'dataEmissao': dataEmissao, 'despesas': [novaDespesa], 'valorTotal': valorLiq }
            finalObj[dataEmissao] = novaData
    ```
4. O próximo passo é inserir cada objeto criado numa lista, que será nosso produto final, e exportar para um arquivo JSON:
    ```py
    listaFinal = []
    keyList = finalObj.keys()
    keyList.sort()

    for key in keyList:
        objetoAtual = finalObj[key]
        listaFinal.append(objetoAtual)

    with open('processado.json', 'w') as resultado:
        json.dump(listaFinal, resultado)
    
    ```

Com os dados exportados nesse formato, a próxima parte irá tratar da visualização inicial:

<div>
    <div id="root"></div>
    <meta charset="utf-8">
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://d3js.org/d3-path.v1.min.js"></script>
    <script src="https://d3js.org/d3-shape.v1.min.js"></script>
    <script src="d3-scale-radial.js"></script>
    <script type="text/javascript" src="script.js"></script>
</div>