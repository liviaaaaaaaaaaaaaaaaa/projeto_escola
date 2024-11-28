const express = require('express')
const path = require('path')
const session = require('express-session')

const app = express()

//Configurações do Servidor
app.set('views', path.join(__dirname, 'views')); // Configura o diretório das views
app.set('view engine', 'ejs')  //Configura o motor de templates para EJS
app.use(express.static(path.join(__dirname, 'public'))); //Define pasta para arquivos css / img
app.use(express.urlencoded({ extended: true })) //Para processar os dados do formulário
app.use(express.json());  // utilizar dados em formato JSON
app.use(session({
    secret: 'sesisenai', //Um segredo para assinar a sessão
    resave: false,
    saveUninitialized: true //Se não houver dados na sessão, não salva
}))

//Middleware para verificar se o usuario está logado
const verificarAutenticacao = (req, res, next) => {
    if(req.session.usuarioLogado) {
        //Disponibilizando o nomeUsuario da sessão para a tela .ejs
        res.locals.nomeUsuario = req.session.nomeUsuario
        next()
    } else {
        res.redirect('/auth/login')
}
}

//Rota da página principal "Landing Page"
app.get('/', (req, res) => {
    //    views/landing/index.ejs
    res.render('landing/index')
})

//Utilizando Rotas admin
const adminRotas = require('./routes/admin')
app.use('/admin', verificarAutenticacao, adminRotas)

//Utilizando Rotas de Professores
const professoresRotas = require('./routes/professoresRotas')
app.use('/professores', verificarAutenticacao, professoresRotas)

//Utilizando Rotas Turmas
const turmasRotas = require('./routes/turmasRotas')
app.use('/turmas', verificarAutenticacao, turmasRotas)

//Utilizando Rotas de Disciplinas
const disciplinasRotas = require('./routes/disciplinasRotas')
app.use('/disciplinas', verificarAutenticacao, disciplinasRotas)

// Utilizando Rotas de alunos
const alunosRotas = require('./routes/alunosRotas')
app.use('/alunos', verificarAutenticacao, alunosRotas)

//Utilizando Rotas de Login
const loginRotas = require('./routes/loginRotas.js')
app.use('/auth', loginRotas)

const porta = 3000
app.listen(porta, ()=>{
    console.log(`Servidor rodando http://localhost:${porta}`)
})