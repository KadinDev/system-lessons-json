
const fs = require('fs') // para criar meu JSON
const data = require('../data.json')


const intl = require('intl')

const { age, date } = require('../utils')

exports.index = function( req, res ){
    return res.render('students/index', { students: data.students } )
}

exports.create = function( req, res ) {
    return res.render('students/create')
}

exports.post = function(req, res){

    // Já faz a validação do formulário
    const keys = Object.keys(req.body)

    for (key of keys){
        if ( req.body[key] == "" ){
            return res.send('Necessário Preecher Todos Os Campos!')
        }
    }
    // end validação

    birth = Date.parse(req.body.birth)

    let id = 1
    const lastStudent = data.students[data.students.length - 1 ]

    if ( lastStudent ){
        id = lastStudent.id + 1
    }
    

    data.students.push({
        id,
        ...req.body,
        birth,
    })
    
    // Criado o JSON do formulário e salvando na raiz do projeto como data.json
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error){
        if (error) return res.send('White file error')
    } )
   

    return res.redirect(`/students/${id}`)
}


exports.show = function( req, res ){
    const { id } = req.params

    const foundStudents = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudents) return res.send('Aluno(a) não registrado no sistema!')

    const students = {
        ...foundStudents,
        age: age(foundStudents.birth)
    }



    return res.render('students/show', { students } )
}

exports.edit = function( req, res ){
    const { id } = req.params

    const foundStudents = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudents) return res.send('Professor não encontrado!')

    const students = {
        ...foundStudents,
        birth: date(foundStudents.birth).iso
    }


    return res.render('students/edit', { students })

}

exports.put = function( req, res ){
    const { id } = req.body
    let index = 0

    const foundStudents = data.students.find(function(students, foundIndex){
        if (students.id == id){
            index = foundIndex
            return true
        }
    })

    if (!foundStudents) return res.send('Professor não encontrado!')

    const student =  {
        ... foundStudents,
        ... req.body,
        
        birth: Date.parse(req.body.birth),

        id: Number(req.body.id)
    }


    data.students[index] = student

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write file error!')

        return res.redirect(`/students/${id}`)
    })
    
}


exports.delete = function( req, res ){
    const { id } = req.body

    const filterStudents = data.students.filter(function(students){

        return students.id != id
    })

    data.students = filterStudents

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write file error!')

        return res.redirect('/students')
    })
}
