var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var methodoverride = require("method-override");
var expresssanitizer=require("express-sanitizer");

// APP CONFIG

mongoose.connect("mongodb://localhost/Restful_blog_app" , { useNewUrlParser: true } );
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodoverride("_method"));
app.use(expresssanitizer());



// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    
    title: String,
    image: String,
    body: String,
    created: {type:Date , default:Date.now}
});

var Blog = mongoose.model("Blog" , blogSchema);

/*Blog.create({
    
    title:"Manali ",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1Gcc78EkJOL5w4msgtJnNrXrWNQNhNxhmRJ4fRx4vg_AkaYVC ",
    body:"This place is popular for trekking "
}); */

//  RESTFUL ROUTES
app.get("/",function(req , res){
    
    res.redirect("/blogs");
    
});

app.get("/blogs" , function(req ,res){
    
    Blog.find({},function(err , blogs){
     if(err){
            console.log(err);
        }
        else{
            
             res.render("index" ,{blogs: blogs});
        }
    });
    
});

// NEW ROUTE

app.get("/blogs/new" , function(req , res){
    res.render("new");
});

//  CREATE ROUTE

app.post("/blogs", function(req , res){
    
    Blog.create(req.body.blog , function(err , newBlog){
        if(err){
            res.render("new");
        }
        else{
            // then redirect to index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE

app.get("/blogs/:id" , function(req , res){
    Blog.findById(req.params.id , function(err , foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show" , {blog: foundBlog});
        }
    });
});
//   EDIT ROUTE

app.get("/blogs/:id/edit", function(req , res){
    
     Blog.findById(req.params.id , function(err , foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit" , {blog: foundBlog});
        }
     });
});

//  UPDATE ROUTE

app.put("/blogs/:id" , function(req , res){
    req.body.blog.body = req.sanitize( req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//  DELETE ROUTE

app.delete("/blogs/:id" , function(req , res){
       
    Blog.findByIdAndRemove(req.params.id , function(err , updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("SERVER IS RUNNING");
});
