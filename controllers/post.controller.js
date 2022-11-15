const Helper = require('../helpers/index');
const PostsModel = require('../models/posts.model');
const moment = require('moment');

class PostController {
    constructor(){

    }

    async wonderwall(req, res){
        if(req.session.user_data){
            let messages = await PostsModel.fetchMessages();
            res.render("wonderwall.ejs", {user_data: req.session.user_data, messages: messages.result, moment: moment});
        }
        else{
            res.redirect("/");
        }
    }

    async add_message(req, res){
        let response_data = {status: false, result: {}, error: null};

        if(req.session.user_data){
            let validate_input = await Helper.validateInput({require: "message"}, req);

            
            if(validate_input.status){
                let add_message = await PostsModel.addMessage({user_id: req.session.user_data.id, message: req.body.message});

                if(add_message.status){
                    response_data.status = true;
                    response_data.result = add_message.result;
                }
                else{
                    response_data.message = add_message.message;
                }
            }
            else{
                response_data.message = validate_input.message;
            }

        }
        else{
            response_data.message = "You are not logged in.";
        }

        res.json(response_data);
    }

    async add_comment(req, res){
        let response_data = {status: false, result: {}, error: null};

        if(req.session.user_data){
            let validate_input = await Helper.validateInput({require: "comment"}, req);

            if(validate_input.status){
                let add_comment = await PostsModel.addComment({user_id: req.session.user_data.id, message_id: req.body.message_id, comment: req.body.comment});

                if(add_comment.status){
                    response_data.status = true;
                    response_data.result = add_comment.result;
                }
                else{
                    response_data.message = add_comment.message;
                }
            }
            else{
                response_data.message = validate_input.message;
            }

        }
        else{
            response_data.message = "You are not logged in.";
        }

        res.json(response_data);
    }

    async delete_message(req, res){
        let response_data = {status: false, result: {}, error: null};

        if(req.session.user_data){
            response_data = await PostsModel.deleteMessage({user_id: req.session.user_data.id, message_id: parseInt(req.body.message_id)});
        }
        else{
            response_data.message = "You are not logged in.";
        }

        res.json(response_data);
    }

    async delete_comment(req, res){
        let response_data = {status: false, result: {}, error: null};

        if(req.session.user_data){
            response_data = await PostsModel.deleteComment({user_id: req.session.user_data.id, comment_id: parseInt(req.body.comment_id)});
        }
        else{
            response_data.message = "You are not logged in.";
        }

        res.json(response_data);
    }
}

module.exports = PostController;