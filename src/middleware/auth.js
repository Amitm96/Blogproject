const jwt = require('jsonwebtoken')
const blogModel = require('../models/blogModel')
const authenticate = function(req , res , next){
    try{
        let token = req.headers["x-api-key"]
        if(!token) return res.status(401).send({status: false , msg: "please provide token"})
        let encodedToken;
        try{
            encodedToken = jwt.verify(token , "first-project")
        }
        catch(err){
            return res.status(400).send({status: false , msg : err.message})
        }
        if(!encodedToken) return res.status(400).send({status: false , msg: "token not valid"})
        else{
            req.encodedToken = encodedToken
            next()
        } 
    }
    catch(err){
        return res.status(500).send({status : false , msg : err.message})
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
    try {
        let decodedToken = req.encodedToken
        let data = req.query
    
        let obj = {};

        if (data.authorId) {
            obj.authorId = data.authorId
        }
        if (data.category) {
            obj.category = data.category
        }
        if (data.tags) {
            obj.tags = data.tags
        }
        if (data.subcategory) {
            obj.subcategory = data.subcategory
        }
        if (data.isPublished) {
            obj.isPublished = data.isPublished
        }
        req.findObj = obj

        let authorIdObject = await blogModel.find(obj).select({ authorId: 1, _id: 0 })
        let id = authorIdObject.map((obj)=>{return obj.authorId.toString()})
    
        if (authorIdObject.length == 0) {return res.status(400).send({status: false , msg: "no such blog" }) }

        let authorIdInToken = decodedToken.authorId

            if ((id.includes(authorIdInToken))) { next()  }
            
          else{  return res.status(403).send({ status: false, msg: 'User logged is not allowed to delete the requested users data' })}

        }
    
    catch (err) {
      return  res.status(500).send({ msg: "Error", error: err.message})
    }
}

module.exports = {authenticate , authorization , queryDeleteAuth}

