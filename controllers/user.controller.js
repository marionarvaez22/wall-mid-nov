const UsersModel = require('../models/users.model');
const Helper = require('../helpers/index');

class UserController {
    constructor(){

    }

    async index(req, res){
        if(!req.session.user_data){
            res.render("index.ejs");
        }
        else{
            res.redirect("/wonderwall");
        }
    }

    async register(req, res){
        let response_data = {status: false, result: {}, error: null};

        let validate_input = await Helper.validateInput({require: "first_name,last_name,email_address,password,confirm_password"}, req);
        
        if(validate_input.status){
            let params = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email_address: req.body.email_address,
                password: req.body.password
            };

            let register_user = await UsersModel.register(params);

            if(register_user.status){
                req.session.user_data = register_user.result;
                response_data.status = true;
                response_data.result.redirect_url = "/wonderwall";
            }
            else{
                response_data.message = register_user.message;
            }
        }
        else{
            response_data.message = validate_input.message;
        }

        res.json(response_data);
    }

    async login(req, res){
        let response_data = {status: false, result: {}, error: null};

        let validate_input = await Helper.validateInput({require: "email_address,password"}, req);

        if(validate_input.status){
            let params = {
                email_address: req.body.email_address,
                password: req.body.password
            };

            let login_user = await UsersModel.login(params);

            if(login_user.status){
                req.session.user_data = login_user.result;
                response_data = login_user;
                response_data.result.redirect_url = "/wonderwall";
            }
            else{
                response_data.message = login_user.message;
            }
        }
        else{
            response_data.message = validate_input.message;
        }

        res.json(response_data);
    }

    async logout(req, res){
        req.session.destroy();
        res.redirect("/");
    }
}

module.exports = UserController;