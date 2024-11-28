const express = require('express')
const router = express.Router()
const BD = require('../db')

//Listar alunos (R - Read)
// Rota localhost:3000/alunos/
router.get('/', async (req, res) => {
    try {
        const busca = req.query.busca || ''
        const ordenar = req.query.ordenar || 'nome'
        const buscaDados = await BD.query(`select a.nome, tur.nome_turma, a.id_aluno
        from alunos as a 
            inner join turmas_escola as tur on a.id_turma = tur.id_turma 
            where upper(a.nome) like $1 or upper(tur.nome_turma) like $1
        order by ${ordenar}`, [`%${busca.toUpperCase()}%`])
    res.render('alunosTelas/lista', {
        vetorDados: buscaDados.rows,
        busca: busca,
        ordenar: ordenar})
    } catch (erro){
        console.log('Erro ao Listar Alunos', erro)
        res.render('alunosTelas/lista', {mensagem: erro})
    }
})

// Rota para abrir tela para criar um novo processor (C - Create)
// Endereço localhost:3000/alunos/novo
router.get('/novo', async (req, res) => {
    try {
        const resultado = await BD.query('select * from turmas_escola order by nome_turma')
        res.render('alunosTelas/criar', {turmasCadastradas: resultado.rows })
    } catch (erro) {    
        console.log('Erro ao abrir tela de cadastro de disciplinas', erro)
        res.render('alunosTelas/criar', {mensagem : erro})
    }
})

router.post('/novo', async (req, res) => {
    try {
        // const {nome, id_disciplina} = req.body
        const nome_aluno = req.body.nome_aluno
        const id_turma = req.body.id_turma
        await BD.query('insert into alunos (nome, id_turma) values ($1, $2)',  [nome_aluno, id_turma])
        res.redirect('/alunos')
    } catch (erro) {
        console.log('Erro ao cadastrar alunos', erro)
        res.render('alunosTelas/criar', {mensagem : erro})
    }
})

// Deletar um Aluno (D - Delete)
// Para acessar /alunos/1/deletar
router.post('/:id/deletar', async (req, res) => {
    const { id } = req.params
    // const id = req.params.id
    await BD.query('delete from alunos where id_aluno = $1', [id])
    res.redirect('/alunos')
})

router.get('/:id/editar', async(req, res) => {
    try {
        const { id } = req.params
        const resultado = await BD.query('select * from alunos where id_aluno = $1', [id])
        // Lista de todos as turmas cadastradas para o select 
        const turmasCadastradas = await BD.query('select * from turmas_escola order by nome_turma')
        const disciplinasCadastradas = await BD.query('select * from disciplinas order by nome_disciplina')
        
        const notas = await BD.query(`
            select d.nome_disciplina, ad.media, ad.nr_faltas, ad.status
from disciplinas as d inner join aluno_disciplinas as ad on d.id_disciplina = ad.id_disciplina
where ad.id_aluno = $1
`, [id])
        res.render('alunosTelas/editar', {
            aluno: resultado.rows[0],
            turmasCadastradas: turmasCadastradas.rows,
            disciplinasCadastradas : disciplinasCadastradas.rows,
            notas: notas.rows
        })
    } catch (erro){
        console.log('Erro ao editar disciplina', erro);
        
    }
})

router.post('/:id/editar', async (req, res) => {
    try{
        const { id } = req.params
        const {nome, id_turma} = req.body
        await BD.query(`update alunos set nome = $1, id_turma = $2
            where id_aluno = $3`, [nome, id_turma, id])
        res.redirect('/alunos/')
    }catch (erro) {
        console.log('Erro ao editar disciplina', erro);
    }
})

//Criando rota para lançar uma nota
router.post('/:id/lancar-nota', async (req, res) => {
    try{
        const { id } = req.params
        const {media, faltas, id_disciplina} = req.body
        await BD.query(`insert into aluno_disciplinas
                        (id_disciplina, id_aluno, media, nr_faltas) values
                        ($1, $2, $3, $4)
             `, [id_disciplina, id, media, faltas])
        res.redirect(`/alunos/${id}/editar`)
    }catch (erro) {

        console.log('Erro ao editar disciplina', erro);
    }
})

module.exports = router
