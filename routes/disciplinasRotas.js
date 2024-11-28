const express = require('express')
const router = express.Router()
const BD = require('../db')

//listar disciplinas (R - read)
//para acessar essa rota digito / disciplinas /
router.get('/', async (req, res) => {
    try {
        const busca = req.query.busca || ''
        const ordenar = req.query.ordenar || 'nome_disciplina'
        const pg = req.query.pg || 1 //Obtendo a pág de dados

        const limite = 3 //Número de registro por página
        const offset = (pg - 1) * limite //Quantidade de registro qe quero "pular"


    const buscaDados = await BD.query(`
        select d.id_disciplina, d.nome_disciplina, p.nome_professor
         FROM disciplinas as d
            left join professores as p on d.id_professor = p.id_professor 
            where upper (d.nome_disciplina) like $1 or upper (p.nome_professor) like $1
        order by ${ordenar}
        limit $2 offset $3`, [`%${busca.toUpperCase()}%` , limite, offset])

        const totalItens  = await BD.query(`
            select count(*) as total
             FROM disciplinas as d
                left join professores as p on d.id_professor = p.id_professor 
                where upper (d.nome_disciplina) like $1 or upper (p.nome_professor) like $1
             `, [`%${busca.toUpperCase()}%`])

             const totalPgs = Math.ceil(totalItens.rows[0].total / limite)

    res.render('disciplinasTelas/lista', {
        vetorDados: buscaDados.rows,
    busca : busca,
    ordenar: ordenar,
    pgAtual : parseInt(pg),
    totalPgs: totalPgs
})

    
    } catch (erro) {
        console.log('erro ao listar disciplinas', erro)
        res.render('disciplinas/lista', {mensagem : erro})

    }
})

//rotas para abrir tela para criar uma nova disciplina (C - create)
//para acessar essa rota digito / disciplinas / novo
router.get('/novo', async(req, res) => {
    try {
        const resultado = await BD.query('select * from professores order by nome_professor')
        res.render('disciplinasTelas/criar', { professoresCadastrados: resultado.rows });

    } catch (erro) {
        console.log('erro ao abrir tela de cadastrar disciplinas',erro)
        res.render('disciplinasTelas/lista', mensagem, {mensagem : erro})
        
    }
})

router.post('/novo', async(req, res) => {
    try {
        const nome_disciplina = req.body.nome_disciplina
        const id_professor = req.body.id_professor
        
        await BD.query('insert into disciplinas (nome_disciplina, id_professor) values ($1, $2)',  [nome_disciplina, id_professor])
        //redirecionando para a tela /disciplinas
        res.redirect('/disciplinas/')

    } catch (erro) {
        console.log('erro ao abrir tela de cadastrar disciplinas', erro)
        res.render('disciplinasTelas/lista', mensagem, {mensagem : erro})
        
    }
})

//excluir uma disciplina (D - delete)
router.post('/:id/deletar', async (req, res) => {
    const {id} = req.params
    await BD.query('delete from disciplinas where id_disciplina = $1', [id])
    res.redirect('/disciplinas')
})

//rotas para editar uma disciplina (E - edit)
//para acessar essa rota digito / disciplinas / editar / :id


router.get('/:id/editar', async(req, res) => {
    try {
        const { id } = req.params
        const resultado = await BD.query('select * from disciplinas where id_disciplina = $1', [id])
        //Lista com todos os profs cadastrado para o select
        const profCadastrados = 
        await BD.query('select * from professores order by nome_professor')
        res.render('disciplinasTelas/editar',{
            disciplina: resultado.rows[0],
            professoresCadastrados: profCadastrados.rows
        })
        
    } catch (erro) {
        console.log('Erro ao editar disciplina', erro);

    }

})
router.post('/:id/editar', async(req, res) => {
    try {
        const {id} = req.params
        const {nome_disciplina, id_professor} = req.body
        await BD.query(`update disciplinas set nome_disciplina = $1, id_professor =$2 where id_disciplina = $3`, [nome_disciplina, id_professor, id])
        res.redirect('/disciplinas/')

    } catch (erro){
        console.log('Erro ao gravar disciplina', erro);
    }
})


module.exports = router
