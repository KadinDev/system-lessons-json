
const fs = require('fs') // para criar meu JSON
const data = require('../data.json')


const intl = require('intl')

const { age, date } = require('../utils')

exports.index = function( req, res ){
    return res.render('teachers/index', { teachers: data.teachers } )
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

    let { name, avatar_url, birth, select, aula, services } = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()

    let id = 1
    const lastTeacher = data.teachers[data.teachers.length - 1 ]

    if ( lastTeacher ){
        id = lastTeacher.id + 1
    }
    
    data.teachers.push({
        id,
        ...req.body,
        name,
        avatar_url,
        birth,
        select,
        aula,
        services,
        created_at // Criando data de quando se cadastrou no formulário
    })



    
    // Criado o JSON do formulário e salvando na raiz do projeto como data.json
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error){
        if (error) return res.send('White file error')
    } )
   

    return res.redirect(`/teachers/${id}`)
}


exports.show = function( req, res ){
    const { id } = req.params

    const foundTeachers = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeachers) return res.send('Professor(a) não encontrado!')

    const teachers = {
        ...foundTeachers,
        age: age(foundTeachers.birth),
        services: foundTeachers.services.split(","),
        created_at: new intl.DateTimeFormat('pt-BR').format(foundTeachers.created_at) 
    }



    return res.render('teachers/show', { teachers } )
}

exports.create = function( req, res ) {
    return res.render('teachers/create')
}

exports.edit = function( req, res ){
    const { id } = req.params

    const foundTeachers = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeachers) return res.send('Professor não encontrado!')

    const teachers = {
        ...foundTeachers,
        birth: date(foundTeachers.birth).iso
    }


    return res.render('teachers/edit', { teachers })

}

exports.put = function( req, res ){
    const { id } = req.body
    let index = 0

    const foundTeachers = data.teachers.find(function(teacher, foundIndex){
        if (teacher.id == id){
            index = foundIndex
            return true
        }
    })

    if (!foundTeachers) return res.send('Professor não encontrado!')

    const teacher =  {
        ... foundTeachers,
        ... req.body,
        
        birth: Date.parse(req.body.birth),

        id: Number(req.body.id)
    }


    data.teachers[index] = teacher

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write file error!')

        return res.redirect(`/teachers/${id}`)
    })
    
}


exports.delete = function( req, res ){
    const { id } = req.body

    const filterTeachers = data.teachers.filter(function(teachers){

        return teachers.id != id
    })

    data.teachers = filterTeachers

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write file error!')

        return res.redirect('/teachers')
    })
}