
var isUserListVisible = false;
var isUserListLoaded = false;

var isUserInfosVisible = false;
var isUserInfosLoaded = false;

var userListData;
var userData;

const username = sessionStorage.getItem("username");
const token = sessionStorage.getItem("authtoken");
//const id = sessionStorage.getItem("id");

function init() {
    usernameElement = document.getElementById("span_username");
    tokenElement = document.getElementById("p_token");
    usernameElement.innerText = username;
    tokenElement.innerText = token;
    

    // ajouter requete get /api/users/username/authorities qui renvoie les permissions

    // sert a generer le html selon les droits
}

function requestAndDisplayUserInfos() {
    if (!isUserInfosVisible) {
        if(!isUserInfosLoaded) {
            
            fetch("http://localhost:8090/api/user/username/" + username, {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token },
            //headers: {"Content-Type": "application/json"},  
            })
            .then(res => res.json())
            .then(data => {
            userData = data;
            displayUserInfos(userData);
            })
            .catch(err => {window.location.href="../html/error.html";});
            isUserInfosLoaded = true;
        }
        else {
            displayUserInfos(userData);
        }
        isUserInfosVisible = true;
        textButtonElement = document.getElementById("p_button_0");
        textButtonElement.innerText="Masquer les infos de cet user";
    }
    else {
        resultElement = document.getElementById("bloc_user_info");
        resultElement.innerHTML = "";
        textButtonElement = document.getElementById("p_button_0");
        textButtonElement.innerText="Afficher les infos de cet user";
        isUserInfosVisible = false;
    }
}

function displayUserInfos(data) {
    let html = "";
    let idDB = data.id;
    let password = data.password;
    let active = data.active;
    let role = getRoleValue(data.role.label);
    let classNameActive = getClassActive(active);
    let classNameRole = getClassRole(data.role.label);
    html += "<p>Id : <span class='orange_text'>" + idDB + "</span></p>";
    html += "<p>Username : <span class='orange_text'>" + username + "</span></p>";
    html += "<p>Password : <span id='password_info'>" + password + "</span></p>";
    html += "<p>Active : <span class='" + classNameActive + "'>" + active + "</span></p>";
    html += "<p>Rôle : <span class='" + classNameRole + "'>" + role + "</span></p>";
    resultElement = document.getElementById("bloc_user_info");
    resultElement.innerHTML = html;
}

function requestAndDisplayListAllUsers() {
    //console.log("clic bouton");

    if (!isUserListVisible) {
        if(!isUserListLoaded) {
            
            fetch("http://localhost:8090/api/user/all", {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token },
            //headers: {"Content-Type": "application/json"},  
            })
            .then(res => res.json())
            .then(data => {
            userListData = data;
            displayUserList(userListData);
            })
            .catch(err => {window.location.href="../html/error.html";})
            ;
            isUserListLoaded = true;
        }
        else {
          displayUserList(userListData);
        }
        isUserListVisible = true;
        textButtonElement = document.getElementById("p_button_1");
        textButtonElement.innerText="Masquer la liste des Users";
        
    }
    else {
        resultElement = document.getElementById("result");
        resultElement.innerHTML = "";
        textButtonElement = document.getElementById("p_button_1");
        textButtonElement.innerText="Afficher la liste des Users";
        isUserListVisible = false;
    }
}

function displayUserList(data) {
    resultElement = document.getElementById("result");
    let string ="<ul>";
    for (let i=0; i<data.length; i++) {
        let usernameDB = data[i].userName;
        //let password= data[i].password;
        let idDB = data[i].id;
        let active = data[i].active;
        let role = data[i].role.label;
        let classNameActive = getClassActive(active);
        let roleValue = getRoleValue(role);
        let classNameRole = getClassRole(role);

        let classNameUsername = "white_text";
        let isUserLogged = (usernameDB == username);
        let buttonHtml = "<span class='button_little'><p class='p_button_little'>Supprimer</p></span>"
        + "<span class='button_little'><p class='p_button_little'>Editer</p></span>" ;
        if(isUserLogged) {
            buttonHtml = "<span class='button_little_disabled'><p class='p_button_little'>Supprimer</p></span>"
            + "<span class='button_little_disabled'><p class='p_button_little'>Editer</p></span>";
            classNameUsername = "orange_text";
        }

        string += "<li><article id='article_user_list'>" + idDB 
        + " : <span class='" + classNameUsername + "'>" + usernameDB 
        + "</span> : <span class=\"" + classNameActive + "\">" + active 
        + "</span> : <span class=\"" + classNameRole + "\">" + roleValue 
        + "</span>" 
        + buttonHtml
        + "</article></li>";
        //console.log(string);
    }
    string += "</ul>";
    resultElement.innerHTML = string;
}

function getClassActive(active) {
    let className;
    if(active) {
            
        className = "green_text";
    }
    else {
       
        className = "red_text";
    }
    return className;
}

function getRoleValue(role) {
    let roleValue;
    switch (role) {
        case "ROLE_ADMIN" :
            roleValue = "Admin";
        break;
        case "ROLE_MANAGER" :
            roleValue = "Manager";
        break;
        case "ROLE_USER" :
            roleValue = "User";
        break;
    };
    return roleValue;
}

function getClassRole(role) {
    let className;
    switch (role) {
        case "ROLE_ADMIN" :
            className = "green_text";
        break;
        case "ROLE_MANAGER" :
            className = "blue_text";
        break;
        case "ROLE_USER" :
            className = "yellow_text";
        break;
    };
    return className;
}