const blogModel = require("../models/blogModel");


let createBlog = async function (req, res) {
    try {
        let Data = req.body;
        let saveData = await blogModel.create(Data);
        res.status(201).send({ msg: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "SERVER ISSUES", reason: err.message })
    }
}



const deleteblog= async function(req, res) {    
try {  
    
    let blogId = req.params.blogId
    let blog = await blogModel.findById(blogId)
    if(!blog) {
        return res.status(404).send({status: false, message: "no such blog exists"})
    } else{  
    let updatedblog = await blogModel.findOneAndUpdate({_id: blogId}, {$set:{isDeleted: true}}, {new: true})
    res.status(200).send({status: true })
  } 
} catch (err) {
 
    
return res.status(500).send({status: false, message: "server err"})

}
}

module.exports.createBlog = createBlog;
module.exports.deleteblog = deleteblog

