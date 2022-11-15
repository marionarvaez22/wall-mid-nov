const Mysql = require('mysql');
const Model = require('./model');
const Helper = require('../helpers/index');

class PostsModel extends Model {
    constructor(){
        super();
    }

    async fetchMessages(){
        let response_data = {status: false, result: {}, error: null};

        try{
            let fetch_messages_query = Mysql.format(`
                SELECT 
                    messages.id, messages.user_id, messages.message, messages.created_at, CONCAT(users.first_name, " ", users.last_name) AS name,
                    (
                        SELECT 
                            JSON_ARRAYAGG(JSON_OBJECT(
                                "commenter", CONCAT(users.first_name, " ", users.last_name),
                                "comment_id", comments.id,
                                "user_id", comments.user_id,
                                "message_id", comments.message_id,
                                "comment", comments.comment,
                                "comment_created_at", comments.created_at
                            ))
                        FROM comments
                        INNER JOIN users ON users.id=comments.user_id
                        WHERE comments.message_id=messages.id
                        GROUP BY comments.message_id
                    ) as comments
                FROM messages
                INNER JOIN users ON users.id=messages.user_id
                ORDER BY messages.id DESC;
            `);

            let fetch_messages_result = await this.executeQuery(fetch_messages_query);

            if(fetch_messages_result){
                response_data.status = true;
                response_data.result = fetch_messages_result;
            }
            
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while fetching messages.";
        }

        return response_data;
    }

    async addMessage(params){
        let response_data = {status: false, result: {}, error: null};

        try{
            let add_message_query = Mysql.format(`INSERT INTO messages SET ?, created_at= NOW()`, [params]);
            let add_message_result = await this.executeQuery(add_message_query);

            if(add_message_result.affectedRows > 0){
                response_data.status = true;
                response_data.result = add_message_result.insertId;
            }
            
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while adding a message.";
        }

        return response_data;
    }

    async addComment(params){
        let response_data = {status: false, result: {}, error: null};

        try{
            let add_comment_query = Mysql.format(`INSERT INTO comments SET ?, created_at= NOW()`, [params]);
            let add_comment_result = await this.executeQuery(add_comment_query);

            if(add_comment_result.affectedRows > 0){
                response_data.status = true;
                response_data.result = add_comment_result.insertId;
            }
            
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while adding a comment.";
        }

        return response_data;
    }

    async deleteMessage(params){
        let response_data = {status: false, result: {}, error: null};

        try{
           let fetch_message = await this.fetchMessage(params.message_id);

           if(fetch_message.status){
                if(fetch_message.result.user_id === params.user_id){
                    let delete_message_query = Mysql.format(`DELETE FROM messages WHERE id IN (?)`, [fetch_message.result.id]);
                    let delete_message_result = await this.executeQuery(delete_message_query);
                    
                    if(delete_message_result){
                        response_data.status = true;
                    }
                }
                else{
                    response_data.message = "You don't own this message.";
                }
           }
           else{
                response_data.message = fetch_message.message;
           }
            
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while deleting a message.";
        }

        return response_data;
    }

    async fetchMessage(message_id){
        let response_data = {status: false, result: {}, error: null};

        try{
            let fetch_message_query = Mysql.format(`SELECT * FROM messages WHERE id IN (?)`, [message_id]);
            let [fetch_message_result] = await this.executeQuery(fetch_message_query);

            if(fetch_message_result){
                response_data.status = true;
                response_data.result = fetch_message_result;
            }
            
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while fetching a message.";
        }

        return response_data;
    }

    async deleteComment(params){
        let response_data = {status: false, result: {}, error: null};

        try{
           let fetch_comment = await this.fetchComment(params.comment_id);

           if(fetch_comment.status){
                if(fetch_comment.result.user_id === params.user_id){
                    let delete_comment_query = Mysql.format(`DELETE FROM comments WHERE id IN (?)`, [fetch_comment.result.id]);
                    let delete_comment_result = await this.executeQuery(delete_comment_query);
                    
                    if(delete_comment_result){
                        response_data.status = true;
                    }
                }
                else{
                    response_data.message = "You don't own this comment.";
                }
           }
           else{
                response_data.message = fetch_comment.message;
           }
            
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while deleting a comment.";
        }

        return response_data;
    }

    async fetchComment(comment_id){
        let response_data = {status: false, result: {}, error: null};

        try{
            let fetch_comment_query = Mysql.format(`SELECT * FROM comments WHERE id IN (?)`, [comment_id]);
            let [fetch_comment_result] = await this.executeQuery(fetch_comment_query);

            if(fetch_comment_result){
                response_data.status = true;
                response_data.result = fetch_comment_result;
            }
            
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Error encountered while fetching a comment.";
        }

        return response_data;
    }
}

module.exports = (function Posts(){
    return new PostsModel;
})();