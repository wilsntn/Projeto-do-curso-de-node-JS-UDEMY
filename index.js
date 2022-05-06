const express = require("express");
const { get } = require("express/lib/request");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
//CONEXÃO COM O BANCO DE DADOS

connection
    .authenticate()
    /**
     * Mesma coisa do try catch do PHP!
     */
    .then(() =>{
        console.log("Conexão efetuada com sucesso!")
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })

//COLOCAR O EJS COMO VIEW ENGINE
app.set('view engine','ejs'); //set para setar a view engine!

//PARA USAR STATICS LOCAIS COMO BOOTSTRAP ETC..
app.use(express.static('public')); //use para usar!

//PARA UTILIZAR O BODYPARSER ! PARA TRATAR DADOS DE FORMULÁRIOS E DE REQUISIÇÕES JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROTAS (LINKS) do webapp
app.get("/", (_req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC'] //ordenar pelo id DESC = DECRESCENTE
    ]}).then(perguntas => { //busca todas as perguntas do banco .then armazena na variavel perguntas..
        res.render("index", {
            perguntas: perguntas //renderiza o que ta vindo do banco e armazena na string para ser usado no frontend
        }); //para exibir o html que está dentro da pasta views!
    })
    
});

app.get("/pergunta", (_req,res) => {
    res.render("pergunta");
});
//ROTAS DO TIPO POST PARA RECEBER DADOS DO USUÁRIO!
app.post("/salvarpergunta",(_req, res) => {
    var titulo = _req.body.titulo;
    var descricao = _req.body.descricao;
//para adicionar dados na tabela do model

    Pergunta.create({ 
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })
});

app.get("/pergunta/:id", (_req, res) => {
    var id = _req.params.id;
    Pergunta.findOne({ //faz a busca no banco de dados de uma coisa só!!
        where: {id: id} //json dentro de outro json para buscar id dentro do banco baseando-se no id do "param" que foi passado!
    }).then(pergunta =>{
        if (pergunta != undefined){ // se pergunta for diferente de undefined quer dizer que ela existe!
            res.render("perguntas",{ 
                pergunta: pergunta //para adicionar o que foi puxado do banco para o front end tem que ser dentro da função render!
            });
        }else { // se nao não foi encontrada
            res.redirect("/")
        }
    })
});



//para subir o express server !
app.listen(3100,() =>{console.log("Server oN!");});