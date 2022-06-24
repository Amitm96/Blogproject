const jwt = require('jsonwebtoken')
const blogModel = require('../models/blogModel')


const authenticate = function(req , res , next){
    try{
        let token = req.headers["x-api-key"]
        if(!token) return res.status(401).send({status: false , msg: "please provide token"})
        let encodedToken = jwt.verify(token , "first-project")
        if(!encodedToken) return res.status(401).send({status: false , msg: "token not valid"})
        else{
            req.encodedToken = encodedToken
            next()
        } 
    }
    catch(err){
        res.status(500).send({status : false , msg : err.message})
    }
    
}


const authorization = async function(req , res , next){
    try{
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId)
        if(!blog) return res.status(400).send({status : false , msg: "blog is not present"})
        let encodedToken = req.encodedToken
        if(blog.authorId != encodedToken.authorId) return res.status(403).send({status: false , msg:"Not authorized to access the blog"})
        else{
            req.blog = blog
            next()
        }
    }
    catch(err){
        res.status(500).send({status:false , msg: err.message})
    }
}

const queryDeleteAuth = async function(req , res , next){
    try{
        let encodedToken = req.encodedToken
        let qAuthorId = req.query.authorId
        if(encodedToken.authorId != qAuthorId && qAuthorId!= undefined) return res.status(400).send({status:false , msg: "can not access different authorid"})
        else{
            req.authorId = encodedToken.authorId
            next()
        }
    }
    catch(err){
        res.status(500).send({status: false , msg : err.message})
    }
}

module.exports = {authenticate , authorization , queryDeleteAuth}

