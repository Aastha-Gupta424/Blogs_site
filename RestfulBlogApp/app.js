var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    port = 3000;

// ==============================================================
// APP CONFIG  
// ==============================================================

mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ==============================================================
// MONGOOSE/MODEL CONFIG
// ==============================================================

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

//******************************************************************

// Blog.create({
//     title: "Test Blog",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTaWAWtSuHOcdRhzR2tphClzFWIxmk4YIXgLA&usqp=CAU",
//     body: "Hey, This is a blog post!"
// });

//******************************************************************


// ==============================================================
//RESTFULL ROUTES
// ==============================================================

app.get("/", function (req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("errr");
        } else {
            res.render("index", { blogs: blogs });
        }
    })
});

// ==============================================================
// NEW ROUTE
// ==============================================================

app.get("/blogs/new", function (req, res) {
    res.render("new");
});

// ==============================================================
// CREATE ROUTE
// ==============================================================

app.post("/blogs", function (req, res) {
    //create blog
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            //then, redirect to index
            res.redirect("/blogs");
        }
    });
});

// ==============================================================
// SHOW ROUTE
// ==============================================================

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    })
});

// ==============================================================
// EDIT ROUTE
// ==============================================================

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    })
});


// ==============================================================
// UPDATE ROUTE
// ==============================================================

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        } 
    });
});

// ==============================================================
// DELETE ROUTE
// ==============================================================
app.delete("/blogs/:id", function(req,res){
// destroy blog
Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
        res.redirect("/blogs");
    } else {
        res.redirect("/blogs");
    }
})
// redirect somewhere
});

// ==============================================================
// START THE SERVER
// ==============================================================

app.listen(port, function () {
    console.log("Server is running");
});