var listaDeps = new Array();
var listaProjetos = new Array();
var tiposProposicoes = new Array();



/* var myChart = document.getElementById("newChart").getContext('2d');
console.log(myChart);
 var myNewChart = new Chart(myChart, {
     type: 'bar',
     data: {
         labels: ["2013", "2014", "2015", "2016", "2017", "2018"],
         datasets: [{
             label: 'Quantidade de projetos',
             data: [totalPorAno("2013"), totalPorAno("2014"), totalPorAno("2015"), totalPorAno("2016"), totalPorAno("2017"), totalPorAno("2018")],
         }]
     }
 }); */



function buscarListaDeps(urlInicio) {
    var corpoResposta;
    var req = new XMLHttpRequest();
    var dados;

    req.open("GET", urlInicio);
    req.onreadystatechange = function (evt) {
        if (req.readyState === req.DONE &&
            req.status >= 200 && req.status < 300) {
            corpoResposta = JSON.parse(req.responseText);

            listaDeps = listaDeps.concat(corpoResposta.dados);

            for (var i = 0; i < corpoResposta.links.length; i++) {

                if (corpoResposta.links[i].rel === "next") {
                    buscarListaDeps(corpoResposta.links[i].href);
                    return;
                }
            }
            menuCarregarOpcoes();
        }
    }
    req.setRequestHeader("Accept", "application/json");
    req.send();
}

buscarListaDeps("https://dadosabertos.camara.leg.br/api/v2/deputados?itens=600");

function buscarProposicoes(urlInicio) {
    var corpoResposta;
    var req = new XMLHttpRequest();
    var dados;

    req.open("GET", urlInicio);
    req.onreadystatechange = function (evt) {
        if (req.readyState === req.DONE &&
            req.status >= 200 && req.status < 300) {
            corpoResposta = JSON.parse(req.responseText);

            tiposProposicoes = tiposProposicoes.concat(corpoResposta.dados);
            menuCarregarProposicoes();
        }
    }
    req.setRequestHeader("Accept", "application/json");
    req.send();
}

buscarProposicoes("https://dadosabertos.camara.leg.br/api/v2/referencias/tiposProposicao");




function buscarProjetos() {
    var corpoResposta;
    var req = new XMLHttpRequest();
    var dados;
    var menuwdg = document.getElementById("menudeps");
    var menuTipo = document.getElementById("tipoProjeto");
    var escolhido = menuwdg.value;
    var tipoEscolhido = menuTipo.value;
    console.log(tipoEscolhido);
    escolhido = escolhido.toLowerCase();
    var url = "https://www.camara.gov.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes?sigla=PL&numero=&ano=2017&datApresentacaoIni=&datApresentacaoFim=&parteNomeAutor=".concat(escolhido).concat("+&idTipoAutor=&siglaPartidoAutor=&siglaUFAutor=&generoAutor=&codEstado=&codOrgaoEstado=&emTramitacao=");
    console.log(url);
    req.open("GET", url, true);
    req.onreadystatechange = function () {
        if (req.readyState === req.DONE &&
            req.status >= 200 && req.status < 300) {
            corpoResposta = JSON.parse(req.responseText);
            listaProjetos = listaProjetos.concat(corpoResposta.dados);
            //console.log(listaProjetos);
        }
    }
    req.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.withCredentials = "true";
    req.setRequestHeader("Accept", "application/json");
    req.send();
}

function menuCarregarOpcoes() {
    var i = 0;
    var menuwdg = document.getElementById("menudeps");
    var opt;

    opt = document.createElement("option");
    opt.text = "Escolha um parlamentar..."
    menuwdg.add(opt);

    while (listaDeps[i]) {

        opt = document.createElement("option");
        opt.text = listaDeps[i].nome;
        menuwdg.add(opt);
        i++;
    }
}
function menuCarregarProposicoes() {
    var i = 0;
    var menuwdg = document.getElementById("tipoProjeto");
    var opt;

    opt = document.createElement("option");
    opt.text = "Escolha um tipo de projeto..."
    menuwdg.add(opt);

    while (tiposProposicoes[i]) {
        opt = document.createElement("option");
        opt.value = tiposProposicoes[i].sigla;
        opt.text = tiposProposicoes[i].nome;
        menuwdg.add(opt);
        i++;
    }
}

function totalPorAno(ano){
    var count; 
    for (var i = 0; i < listaProjetos.length; i++){
        if(listaProjetos[i].ano == ano){
            count ++;
        }
    }
    return count;
}

function menuOpcaoEscolhida() {
    var escolhido;
    var menuwdg = document.getElementById("menudeps");

    escolhido = menuwdg.value;
    for (var i = 0; i < listaDeps.length; i++) {
        if (listaDeps[i].nome === escolhido) {
            mostrarDeputado(listaDeps[i]);
        }
    }
}
function menuProposicaoEscolhida() {
    var escolhido;
    var menuwdg = document.getElementById("tipoProjeto");
    escolhido = menuwdg.value;
}

function mostrarDeputado(dep) {
    var wdgFoto = document.getElementById("fotodep");
    var wdgNome = document.getElementById("nomedep");
    var wdgPartEst = document.getElementById("part-est");

    wdgFoto.setAttribute("src", dep.urlFoto);

    wdgNome.innerHTML = dep.nome;
    wdgPartEst.innerHTML = dep.siglaPartido + "-" + dep.siglaUf;
}