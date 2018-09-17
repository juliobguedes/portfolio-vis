# coding: utf-8
# O comentário acima identifica que, durante a manipulação
# dos dados, trataremos a codificação no padrão
# UTF-8.
import json # Biblioteca que será usada para exportar os dados

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

listaFinal = []
keyList = finalObj.keys()
keyList.sort()

for key in keyList:
    objetoAtual = finalObj[key]
    listaFinal.append(objetoAtual)

with open('processado.json', 'w') as resultado:
    json.dump(listaFinal, resultado)