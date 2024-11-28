const express = require('express')
const router = express.Router()
const BD = require('../db')

//Lista professores (R - Read)
//Para acessar essa rota digito /professores/
router.get('/', async  (req, res) => {
    const buscaDados = await BD.query('SELECT * FROM professores')
    res.render('professoresTelas/lista', { professores: buscaDados.rows })
})

//Rota para abrir tela para criar um novo processo (C - Create)
//para acessar /professores/novo
router.get('/novo', (req, res) => {
    res.render('professoresTelas/criar')
})

router.post('/novo', async (req,res) =>{
    const {nome_professor, telefone, formacao} = req.body
    //const nome_professor = req.body.nome_professor
    //const telefone = req.body.telefone
    //const formacao = req.body.formacao
    await BD.query('insert into professores (nome_professor, telefone, formacao) values($1, $2, $3)', [nome_professor, telefone, formacao])
    res.redirect('/professores')

})

//Excluir um professor (D - Delete)
//para acessar /professores/1/deletar
router.post('/:id/deletar', async (req, res) => {
    const id = req.params.id
    await BD.query('delete from professores where id_professor = $1', [id])
    res.redirect('/professores')
})

//Editar um Profressor (U - Update)
//Para acessar /professores/editar
router.get('/:id/editar', async (req, res) =>{
    const {id} = req.params
    const resultado = await BD.query('select * from professores where id_professor = $1', [id])
    res.render('professoresTelas/editar', {professor: resultado.rows[0]})
})

router.post('/:id/editar', async (req, res) => {
    const {id} = req.params
    const {nome_professor, telefone, formacao} = req.body
    await BD.query(`update professores set nome_professor = $1, telefone = $2, formacao = $3 where id_professor = $4`, [nome_professor, telefone, formacao, id])
    res.redirect('/professores')
})

module.exports = router
