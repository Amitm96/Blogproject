const authorModel = require('../models/authorModel');
const blogModel = require("../models/blogModel");
const jwt = require("jsonwebtoken");

const mid1 = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) { token = req.headers["x-api-key"]; }

        if (!token) { return res.status(401).send({ status: false, msg: "token must be present" }); }
        console.log(token);

        let decodedToken = jwt.verify(token, "ourFirstProject");
        if (!decodedToken) { return res.status(401).send({ status: false, msg: "token is invalid" }); }
        req.token = decodedToken
        next()
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}
const mid2 = async function (req, res, next) {
    try {
        let decodedToken = req.token

        let blogId = req.params.blogId
        let authorIdObject = await blogModel.findById(blogId).select({ authorId: 1, _id: 0 })
        if (!authorIdObject) { return res.status(400).send({ msg: "no such blog" }) }

        let authorIdInToken = decodedToken.authorId
        let idInBlog = authorIdObject.authorId
        if (idInBlog != authorIdInToken) { return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' }) }
        next()
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}
const mid3 = async function (req, res, next) {
    try {
        let decodedToken = req.token
        let authorIdInBody = req.body.authorId

        let isValidAuth = await authorModel.findById(authorIdInBody)
        if (isValidAuth === null) return res.status(400).send({ status: false, msg: "please enter correct authorid" })

        let authorIdInToken = decodedToken.authorId
        if (authorIdInBody != authorIdInToken) { return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' }) }
        next()
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

const mid4 = async function (req, res, next) {
    try {
        let decodedToken = req.token
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
    
        if (authorIdObject.length == 0) {return res.status(400).send({ msg: "no such blog" }) }

        let authorIdInToken = decodedToken.authorId

            if ((id.includes(authorIdInToken))) { next()  }
            
          else{  return res.status(403).send({ status: false, msg: 'User logged is not allowed to delete the requested users data' })}

        }
    
    catch (err) {
      return  res.status(500).send({ msg: "Error", error: err.message})
    }
}

module.exports.mid1 = mid1
module.exports.mid2 = mid2
module.exports.mid3 = mid3
module.exports.mid4 = mid4