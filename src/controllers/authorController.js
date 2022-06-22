const authorModel = require('../models/authorModel');
const validator = require('validator')

const isValid = function(val){
    if(typeof val === "undefined" || val === null) return false
    if(typeof val === "string" && val.trim().length === 0 ) return false
    return true;
}

const bodyValidator = function(data){
    return Object.keys(data).length > 0
}
const createAuthor = async function (req, res) {
    try {
        let data = req.body 

        if(!bodyValidator(data)) return res.status(400).send({status : false , msg : "please enter body"})
        if(!isValid(data.fname)) return res.status(400).send({status : false , msg : "please enter first name"})
        if(!isValid(data.lname)) return res.status(400).send({status : false , msg : "please enter last name"})
        if(!isValid(data.title)) return res.status(400).send({status : false , msg : "please enter title"})
        if(!isValid(data.email)) return res.status(400).send({status : false , msg : "please enter email"})
        if(!isValid(data.password)) return res.status(400).send({status : false , msg : "please enter password"})
        
        if(!(validator.isEmail(data.email))) return res.status(400).send({status : false , msg : "please enter a valid email"})

        let usedEmail = await authorModel.findOne({email : data.email})
        if(usedEmail) return res.status(400).send({status : false , msg : `${data.email} already registered`})

        let author = await authorModel.create(data)

        res.status(201).send({status: true , msg : " author created successfully" , data : author})
        
    }
    catch(err){
        res.status(500).send({errror : err.message})
    }
}

module.exports = {createAuthor}