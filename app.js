var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer")

mongoose.connect("mongodb://localhost/blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    created: { type: Date, default: Date.now }
});
var Blogs = mongoose.model("Blog", blogSchema);

Blogs.create({
    title: "first blog",
    image: "https://www.jisc.ac.uk/sites/default/files/blogging.jpg",
    content:"this is the test for the blog app"
});
//index
app.get("/blogs", function (req, res) {
    Blogs.find({}, function (err, allBlogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { allBlogs: allBlogs });
        }
    });


});
//Create
app.post("/blogs", function (req, res) {

    var blog = req.body.blog;
    blog.content = req.sanitize(blog.content);
    Blogs.create(blog, function (err, blog) {
        if (err) {
            console.log(err)
        } else {
         
            res.redirect("/blogs");
        }
    });
});
// Update
app.put("/blogs/:id", function (req, res) {

    Blogs.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updateBlog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//destroy
app.delete("/blogs/:id", function (req, res) {
    Blogs.findByIdAndRemove(req.params.id, function (err, blogDeleted) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});
//New
app.get("/blogs/new", function (req, res) {
    res.render("new");
});
//Show
app.get("/blogs/:id", function (req, res) {
    Blogs.findById(req.params.id).exec(function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});
//Edit
app.get("/blogs/:id/edit", function (req, res) {
    Blogs.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", { blog: foundBlog })
        }
    })

});

app.listen(3000, function () {
    console.log("blog app started!!!");
});