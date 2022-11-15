const Express = require("express");
const AllRoutes = Express.Router();
const UserController = require('../controllers/user.controller');
const PostController = require('../controllers/post.controller');

AllRoutes.get("/", function(req, res, next){
    new UserController().index(req, res);
});

AllRoutes.post("/register", function(req, res, next){
    new UserController().register(req, res);
});

AllRoutes.post("/login", function(req, res, next){
    new UserController().login(req, res);
});

AllRoutes.get("/logout", function(req, res, next){
    new UserController().logout(req, res);
});

AllRoutes.get("/wonderwall", function(req, res, next){
    new PostController().wonderwall(req, res);
});

AllRoutes.post("/add_message", function(req, res, next){
    new PostController().add_message(req, res);
});

AllRoutes.post("/add_comment", function(req, res, next){
    new PostController().add_comment(req, res);
});

AllRoutes.post("/delete_message", function(req, res, next){
    new PostController().delete_message(req, res);
});

AllRoutes.post("/delete_comment", function(req, res, next){
    new PostController().delete_comment(req, res);
});

module.exports = AllRoutes;