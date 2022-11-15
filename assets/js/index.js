$(document).ready(function(){
    $("body")
        .on("submit","#register", Register)
        .on("submit","#login", Login);
});

function Register(e){
    e.preventDefault();
    let form = $("#register");
    
    $.post(form.attr("action"), form.serialize(), function(response_data){
        if(response_data.status){
            window.location.href = response_data.result.redirect_url;
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}

function Login(e){
    e.preventDefault();
    let form = $("#login");
    
    $.post(form.attr("action"), form.serialize(), function(response_data){
        if(response_data.status){
            window.location.href = response_data.result.redirect_url;
        }
        else{
            alert(response_data.message);
        }
    }, "json");

    return false;
}