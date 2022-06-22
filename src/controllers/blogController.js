
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



const getBlogs = async function (req, res) {
    try { 
       let authorId = req.query.authorId
       let category = req.query.category
       let tags = req.query.tags
       let subcategory = req.query.subcategory
   
       let obj = {
           isDeleted: false,
           isPublished: false
       }
   
       if (authorId) {
           obj.authorId = authorId
       }
       if (category) {
           obj.category = category
       }
       if (tags) {
           obj.tags = tags
       }
       if (subcategory) {
           obj.subcategory = subcategory
       }
   
       let savedData = await blogModel.find(obj)
       if (savedData.length == 0) {
           return res.status(400).send({ status: true, msg: "No such Blogs Available" })
       } else {
           return res.status(200).send({ msg: savedData })
       } }catch(err){
           res.status(500).send({ msg: err.message })
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
            let date = new Date();
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
            if (blog.isDeleted == false) {
                blog.isDeleted = true
                blog.save()
                res.status(200).send({status:true,})
            } else{
                res.status(404).send({msg : "already deleted"})
            }
        }
        else {
            res.status(404).send({ status: flase, msg: "blog dosen't exist" })
        }
    }
    catch(err){
        res.status(500).send({msg : err.message})
    }
    
}



const deleteBlogByQuery = async function(req , res){
    try{
        let authorId = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        let isPublished = req.query.isPublished

        let obj = {};

        if (authorId) {
            obj.authorId = authorId
        }
        if (category) {
            obj.category = category
        }
        if (tags) {
            obj.tags = tags
        }
        if (subcategory) {
            obj.subcategory = subcategory
        }
        if (isPublished) {
            obj.isPublished = isPublished
        }

        let blogs = await blogModel.find(obj)
        // console.log(blogs);
        if(blogs.length > 0){
            // let blogIds = blogs.map(e => e._id)
            let updatedBlogs = await blogModel.updateMany(obj,{$set: {isDeleted : true}})
            res.status(200).send({status : true})
        }
        else{
            res.status(404).send({status : false , msg: "no such blog available"})
        }
        
    }
    catch(err){
        res.status(500).send({msg : err.message})
    }
}



module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs
module.exports.updatedBlogs = updatedBlogs;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByQuery = deleteBlogByQuery;
