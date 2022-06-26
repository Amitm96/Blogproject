const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")
const middleware = require("../middleware/middleware")

router.post("/authors", authorController.createAuthor)

router.post("/login", authorController.loginAuthor)

router.post("/blogs",middleware.mid1,middleware.mid3, blogController.createBlog)

router.get("/blogs",middleware.mid1, blogController.getBlogs)

router.put("/blogs/:blogId",middleware.mid1,middleware.mid2, blogController.updatedBlogs)

router.delete("/blogs/:blogId",middleware.mid1 ,middleware.mid2, blogController.deleteBlog)

router.delete("/blogs" ,middleware.mid1,middleware.mid4, blogController.deleteBlogByQuery)


module.exports = router;