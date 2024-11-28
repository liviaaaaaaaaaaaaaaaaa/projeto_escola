const express = require('express')
const router = express.Router()
const BD = require('../db')


router.get('/', async (req, res) => {
    const buscaDados = await BD.query('SELECT * FROM turmas_escola')
    res.render('turmasTelas/lista', { turmas: buscaDados.rows })
})


router.get('/novo', (req, res) => {
    res.render('turmasTelas/criar')
})

router.post('/novo', async (req, res) => {
    const { nome_turma } = req.body
  
    await BD.query(`insert into turmas_escola (nome_turma)
                         values ($1)`, [nome_turma])
    res.redirect('/turmas_escola')
})


router.post('/:id/deletar', async (req, res) => {
    const { id } = req.params
   
    await BD.query('delete from turmas_escola where id_turma = $1', [id])
    res.redirect('/turmas_escola')
})


router.get('/:id/editar', async (req, res) => {
    const { id } = req.params
    const resultado = await BD.query('select * from turmas_escola where id_turma = $1', [id])
    res.render('turmasTelas/editar', {turma: resultado.rows[0] })
})

router.post('/:id/editar', async (req, res) => {
    const { id } = req.params
    const { nome_turma } = req.body 
    await BD.query('update turmas_escola set nome_turma =$1 where id_turma =$2', [nome_turma, id])
        res.redirect('/turmas_escola')
})

module.exports = router 
