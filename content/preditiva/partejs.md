---
title: "Períodos de Gastos - Parte 2.1: Pré-processamento para a Visualização em JS"
date: 2018-09-17T00:29:09-03:00
draft: false
---

Como dito anteriormente, essa parte do tutorial seria sobre o processamento necessário para a visualização. Nessa etapa do tutorial, trataremos dessa transformação usando JavaScript. Caso você prefira usar Python, siga para a parte 2.2 do tutorial :).

O ponto positivo de fazer em JavaScript é que não é necessário saber (ou aprender) mais uma linguagem de programação para fazer o que se precisa para plotar os gráficos. Entretanto, há um grande contraponto: a página demora a carregar, e a experiência do usuário pode ser negativa caso a página demore muito a fazê-lo. É também importante lembrar **sempre** que JS é **funcional e assíncrono**. Assim, funções como map e reduce sempre são bem-vindas.

Em qualquer das formas, o processo é simples, e há duas formas de fazer: Criando um array ou um objeto para manipular os dados. Criando um array evita um dos passos, mas criando um objeto diminui a complexidade do pré-processamento. Minha estratégia, portanto será usando um objeto. Vejamos os passos:

1. Crie um objeto Y, inicialmente vazio;
2. Para cada objeto X do array inicial:
    1. Se a `dataEmissao` de X já existe como atributo no objeto:
        1. Recupere o objeto W, que é valor do atributo;
        2. Se existe um objeto Z com o `tipoDespesa` no array `despesas` de W:
            1. Recupere Z e atualize seu `valorLiq` com o `valorLiq` de X;
        3. Se não existe:
            1. Insira um novo objeto com o valorLiq e tipoDespesa de X no array `despesas` de W;
        4. Atualize o `valorTotal` de W;
    2. Se não existe:
        1. Crie um novo objeto com os atributos `dataEmissao`, `despesas` e `valorTotal`;
        2. A `dataEmissao` desse novo objeto é a mesma de X;
        3. `despesas` será um array, onde será inserido um novo objeto, com os campos `valorLiq` e `tipoDespesa` iguais aos de X;
        4. O `valorTotal` será, inicialmente, igual ao valorLiq de X;
        5. Crie um novo atributo para Y com valor igual a `dataEmissao` do objeto criado, e o valor desse atributo é o próprio objeto; 
3. Crie um array A vazio;
4. Para cada chave de Y, insira o objeto que é valor em A;
5. Ordene A pelos atributos `dataEmissao` dos objetos

Em termos de código JavaScript, nossa transformação teria a seguinte forma:

```javascript
const timeParser = d3.timeParse('%d/%m');

const setUp = (data) => {
    const group = {}; // 1.
    data.map(element => { // 2.
        // Transforma-se a string em number
        element.valorLiq = Math.round(+element.valorLiq);
        const currentDate = group[element.dataEmissao];
        if (currentDate) { // 2.1
            const hasElement = currentDate.despesas.filter(cur => { // 2.1.1
                return cur.tipoDespesa === element.tipoDespesa;
            });
            if (hasElement.length > 0) { // 2.1.2
                hasElement[0].valorLiq += element.valorLiq; // 2.1.2.1
            } else { // 2.1.3
                currentDate.despesas.push({ // 2.1.3.1
                    tipoDespesa: element.tipoDespesa,
                    valorLiq: +element.valorLiq
                });
            }
            currentDate.valorTotal += +element.valorLiq; // 2.1.4
        } else { // 2.2
            const newElement = { // 2.2
                dataEmissao: timeParser(element.dataEmissao),
                despesas: [
                    {
                        tipoDespesa: element.tipoDespesa,
                        valorLiq: +element.valorLiq
                    }
                ],
                valorTotal: +element.valorLiq,
            };
            group[element.dataEmissao] = newElement;
        }
    });

    return Object.keys(group).map(key => group[key]) // 2.3 e 2.4
        .sort((a,b) => { // 2.5
        if (a.dataEmissao === b.dataEmissao) return 0;
        if (a.dataEmissao < b.dataEmissao) return -1;
        return 1;
    });
};
```

Com os dados nesse formato, a próxima parte irá tratar da visualização inicial:

<div>
    <div id="root"></div>
    <meta charset="utf-8">
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://d3js.org/d3-path.v1.min.js"></script>
    <script src="https://d3js.org/d3-shape.v1.min.js"></script>
    <script src="d3-scale-radial.js"></script>
    <script type="text/javascript" src="script.js"></script>
</div>