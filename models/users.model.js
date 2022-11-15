const Mysql = require('mysql');
const Model = require('./model');
const Helper = require('../helpers/index');

class UsersModel extends Model {
    constructor(){
        super();
    }

    async register(params){
        let response_data = {status: false, result: {}, error: null};

        try{
            /* Check if user is existing */ 
            let existing_user_record = await this.fetchUser("id,email", params.email_address);

            if(!existing_user_record.status){
                let encrypted_password = await Helper.encryptString(params.password);

                let user_data = {
                    first_name: params.first_name,
                    last_name: params.last_name,
                    email: params.email_address,
                    password: encrypted_password,
                    created_at: new Date()
                }

                /* Insert user record */
                let add_user = await this.addUser(user_data);

                if(add_user.status){
                    response_data.status = true;
                    response_data.result = user_data;
                    response_data.result.id = add_user.result.id;

                    delete response_data.result.password;
                }
                else{
                    response_data.message = add_user.message;
                }
            }
            else{
                response_data.message = "User record already registered. Please login instead.";
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while registration.";
        }
         
        return response_data;
    }

    async login(params){
        let response_data = {status: false, result: {}, error: null};

        try{
            /* Check if user is existing */ 
            let existing_user_record = await this.fetchUser("id, first_name, last_name, email, password", params.email_address);

            if(existing_user_record.status){
                let encrypted_password = await Helper.encryptString(params.password);

                if(encrypted_password === existing_user_record.result.password){
                    response_data.status = true;
                    delete existing_user_record.result.password;

                    response_data.result = existing_user_record.result;
                }
                else{
                    response_data.message = "Please enter correct credentials.";
                }
            }
            else{
                response_data.message = "Cannot find user. Please register instead.";
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while registration.";
        }
         
        return response_data;
    }

    async fetchUser(select_fields, email_address){
        let response_data = {status: false, result: {}, error: null};

        try{
            let fetch_user_query = Mysql.format(`SELECT ${select_fields} FROM users WHERE email = ? LIMIT 1;`, [email_address]);
            let [fetch_user_result] = await this.executeQuery(fetch_user_query);

            if(fetch_user_result){
                response_data.status = true;
                response_data.result = fetch_user_result;
            }
            else{
                response_data.message = "No user record found.";
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while fetching user record.";
        }
         
        return response_data;
    }

    async addUser(user_data){
        let response_data = {status: false, result: {}, error: null};

        try{
            let add_user_query = Mysql.format(`INSERT INTO users SET ?`, [user_data]);
            let add_user_result = await this.executeQuery(add_user_query);

            if(add_user_result.affectedRows > 0){
                response_data.status = true;
                response_data.status = add_user_result.insertId;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while adding user record.";
        }
         
        return response_data;
    }
}

module.exports = (function Users(){
    return new UsersModel;
})();