
var isUserListVisible = false;
var isUserListLoaded = false;

var isUserInfosVisible = false;
var isUserInfosLoaded = false;

var isAddUserVisible = false;

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

function displayAddUsers() {
    if (!isAddUserVisible) {
        let html = "";
        html += "<form id='form_user_add'>"
        + '<div class="champ_form" id="champ_username">'
        + '<label for="username">Username</label>'
        + '<input class="input" type="text" id="username" name="username">'
        + '</div>'
        + '<div class="champ_form" id="champ_password">'
        + '<label for="password">Password</label>'
        + '<input class="input" type="text" id="password" name="password">'
        + '</div>'
        + '<div class="champ_form" id="champ_active">'
        + '<label for="active">Active</label>'
        + '<input type= "radio" class="radio_user_add" name="active" value="true" checked><span class= "text_radio_user_add">Oui</span>'
        + '<input type= "radio" class="radio_user_add" name="active" value="false"><span class= "text_radio_user_add">Non</span>'
        + '</div>'
        + '<div class="champ_form" id="champ_role">'
        + '<label for="role">Role</label>'
        + '<input type="radio" class="radio_user_add" name="role" value="user" checked><span class= "text_radio_user_add">User</span>'
        + '<input type="radio" class="radio_user_add" name="role" value="manager"><span class= "text_radio_user_add">Manager</span>'
        + '<input type="radio" class="radio_user_add" name="role" value="admin"><span class= "text_radio_user_add">Admin</span>'
        + '</div>'
        + '<div class="champ_form" id="bloc_button_user_add">'
        + '<button class="button" type="button" onclick="createUserRequest()">Créer user</button>'
        + '<button class="button" type="reset">Effacer</button>'
        + '</div>'

        html += "</form>";
        resultElement = document.getElementById("bloc_user_add");
        resultElement.innerHTML = html;
        textButtonElement = document.getElementById("p_button_2");
        textButtonElement.innerText="Masquer ajouter un user";
        isAddUserVisible = true;
    }
    else {
        resultElement = document.getElementById("bloc_user_add");
        resultElement.innerHTML = "";
        textButtonElement = document.getElementById("p_button_2");
        textButtonElement.innerText="Ajouter un user";
        isAddUserVisible = false;
    }
}

function createUserRequest() { // localhost:8090/api/admin/create
    // récupérer données du formulaire
    // formatter les données
    // tester données

    // faire requete post avec header body

    // si requete ok 
        // fermer div
        // mettre a jour boolean list loaded
        // fermer div list

    // sinon page error

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