const express = require('express')
const router = express.Router()
const BD = require('../db')

//ROTA principal do painel administrativo
router.get('/', async (req, res) => {
    const qAlunos = await BD.query(`select count (*) as total_alunos from alunos`)

    const qDisciplinas = await BD.query(`select count (*) as total_disciplinas from disciplinas`)

    const qMediaDisciplinas = await BD.query(`
    select disciplinas.nome_disciplina, avg(aluno_disciplinas.media) as media
    from disciplinas 
        inner join aluno_disciplinas on disciplinas.id_disciplina = aluno_disciplinas.id_disciplina
    group by disciplinas.nome_disciplina`)


    const qStatusAluno = await BD.query(`select status, count(*) as total from aluno_disciplinas group by status`)


    //    views/landing/index.ejs
    res.render('admin/dashboard', {
        totalAlunos: qAlunos.rows[0].total_alunos,
        totalDisciplinas: qDisciplinas.rows[0].total_disciplinas,
        mediaDisciplinas: qMediaDisciplinas.rows,
        statusAluno: qStatusAluno.rows
    })

})

module.exports = router
