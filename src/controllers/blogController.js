const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel")

const isValid = function(val){
    if(typeof val === "undefined" || val === null) return false
    if(typeof val === "string" && val.trim().length === 0 ) return false
    return true;
}

const bodyValidator = function(data){
    return Object.keys(data).length > 0
}

let createBlog = async function (req, res) {
    try {
        let Data = req.body;
        if(!bodyValidator(Data)) return res.status(400).send({status : false , msg : "please enter body"})
        if(!isValid(Data.title)) return res.status(400).send({status : false , msg : "please enter title"})
        if(!isValid(Data.body)) return res.status(400).send({status : false , msg : "please enter body"})
        if(!isValid(Data.authorId)) return res.status(400).send({status : false , msg : "please enter authorId"})
        if(!isValid(Data.category)) return res.status(400).send({status : false , msg : "please enter category"})
        
        let isValidAuth = await authorModel.findById(Data.authorId)
        if(isValidAuth === null) res.status(400).send({status: false , msg: "please enter correct authorid"})
        
        let blog = await blogModel.create(Data)
        res.status(201).send({status: true , msg: "blog created successfully"})
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "SERVER ISSUES", reason: err.message })
    }
}


const updatedBlogs = async function(req , res){
    try{
        let {title , body , tags , subcategory} = req.body
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId);
        if(blog  && blog.isDeleted === false){
            if(title){
                blog.title = title
            }
            if(body){
                blog.body = body
            }
            if(tags){
                blog.tags.push(tags)
            
            }
            if(subcategory){
                blog.subcategory.push(subcategory)
                
            }
            blog.isPublished = true
            let date = new Date()
            blog.publishedAt = date
            blog.save()
            res.status(200).send({status: true , data: blog})
        }
        else{
            res.status(404).send({status: false , msg: "data not found or deleted"})
        }
    }
    catch(err){
        res.status(500).send({error : err.message})
    }

}


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId)
        if (blog) {
            if (!blog.isDeleted) {
                blog.isDeleted = true
                blog.save()
                res.status(200)
            }
        }
        else {
            res.status(404).send({ status: flase, msg: "blog is not found" })
        }
    }
    catch(err){
        res.status(500).send({msg : err.message})
    }
    
}

const deleteBlogByparam = async function(req , res){
    try{
        let category = req.query
        let blogs = await blogModel.find(category)
        if(blogs.length > 0){
            let blogIds = blogs.map(e => e._id)
            let updatedBlogs = blogModel.updateMany({_id : {$in : blogIds}}, {isDeleted : true})
            res.status(200)
        }
        else{
            res.status(404).send({status : false , msg: ""})
        }
        
    }
    catch(err){
        res.status(500).send({msg : err.message})
    }
}


module.exports.createBlog = createBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByparam = deleteBlogByparam;
module.exports.updatedBlogs = updatedBlogs;