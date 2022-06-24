const jwt = require('jsonwebtoken')
const blogModel = require('../models/blogModel')





const authenticate = function(req , res , next){
    try{
        let token = req.headers["x-api-key"]
        if(!token){
             return res.status(401).send({status: false , msg: "please provide token"})}
        let decodedToken = jwt.verify(token , "first-project")
        if(!decodedToken) {
            return res.status(401).send({status: false , msg: "token not valid"})}
        else{
            req.decodedToken = decodedToken
            next()
        } 
    }
    catch(err){
        res.status(500).send({status : false , msg : err.message})
    }
    
}




const authorization = async function(req , res , next){
    try{
        
        let decodedToken = req.decodedToken
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId)
        if(!blog) return res.status(400).send({status : false , msg: "blog is not present"})
        
        if(blog.authorId != decodedToken.authorId) {  
        return res.status(403).send({status: false , msg:"Unauthorized Author"})}
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
        let decodedToken = req.decodedToken
        let qAuthorId = req.query.authorId
        if(decodedToken.authorId != qAuthorId && qAuthorId!= undefined) 
        {return res.status(400).send({status:false , msg: "Unauthorized Author"})}

        else{
            req.authorId = decodedToken.authorId
            next();
        }
    }
    catch(err){
        res.status(500).send({status: false , msg : err.message})
    }
}





module.exports = {authenticate , authorization , queryDeleteAuth}
