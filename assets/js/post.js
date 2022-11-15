$(document).ready(function(){
    $("body")
        .on("submit", "#add_message", addMessage)
        .on("submit", ".add_comment", addComment)
        .on("click", ".delete_message", deleteMessage)
        .on("click", ".delete_comment", deleteComment);
});

function addMessage(e){
    e.preventDefault();
    let form = $("#add_message");
    
    $.post(form.attr("action"), form.serialize(), function(response_data){
        if(response_data.status){
            window.location.href = "/wonderwall";
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}

function addComment(e){
    e.preventDefault();
    let form = $(this);
    
    $.post(form.attr("action"), form.serialize(), function(response_data){
        if(response_data.status){
            window.location.href = "/wonderwall";
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}

function deleteMessage(e){
    e.preventDefault();
    let message = $(this);
    
    $.post("/delete_message", {message_id: parseInt(message.attr("data-attr-message-id"))}, function(response_data){
        if(response_data.status){
            window.location.href = "/wonderwall";
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}

function deleteComment(e){
    e.preventDefault();
    let comment = $(this);
    
    $.post("/delete_comment", {comment_id: parseInt(comment.attr("data-attr-comment-id"))}, function(response_data){
        if(response_data.status){
            window.location.href = "/wonderwall";
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}



