
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
        + '<input type= "radio" class="radio_user_add" name="active" name="active" value="true" checked><span class= "text_radio_user_add">Oui</span>'
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
    let usernameElement = document.getElementById("username");
    let passwordElement = document.getElementById("password");
    let activeElement = document.querySelector('input[name="active"]:checked');
    let roleElement = document.querySelector('input[name="role"]:checked');
    let usernameValue = usernameElement.value;
    let passwordValue = passwordElement.value;
    let activeNonFormatted = activeElement.value;
    let roleNonFormatted = roleElement.value;

    // formatter les données
    let activeValue = getFormattedActive(activeNonFormatted);
    let roleValue = getFormattedRole(roleNonFormatted);
    let roleId = getRoleId(roleNonFormatted);

   // tester données
    console.log('usernameValue', usernameValue);
    console.log('passwordValue', passwordValue);
    console.log('activeValue', activeValue);
    console.log('roleValue', roleValue);
    console.log('roleId', roleId);

    // faire requete post avec header body  
    const roleContent = {
        id: roleId,
        label: roleValue
    };

    const contentHeader = {
        userName: usernameValue,
        password: passwordValue,
        active: activeValue,
        role: roleContent
    };

    fetch("http://localhost:8090/api/admin/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        //headers: {"Content-Type": "application/json"},  
        body: JSON.stringify(contentHeader)
    })
      //.then(res => res.status)
    .then(res => {
        resultElement = document.getElementById("result");
        resultElement.innerHTML = "";
        textButtonElement = document.getElementById("p_button_1");
        textButtonElement.innerText="Afficher la liste des Users";
        resultElement = document.getElementById("bloc_user_add");
        resultElement.innerHTML = "";
        textButtonElement = document.getElementById("p_button_2");
        textButtonElement.innerText="Ajouter un user";
        isAddUserVisible = false;
        isUserListVisible = false;
        isUserListLoaded = false;
        alert("Ajout user ok : " + res.ok);
    })
    .catch(err => {
        //console.log('erreur requete : ' + err);
        window.location.href="../html/error.html";
    });
}

function getRoleId(roleNonFormatted) {
    switch (roleNonFormatted) {
        case "user" :
            return 3;
        case "manager" :
            return 2;
        case "admin" :
            return 1;
    }
}

function getFormattedRole(roleNonFormatted) {
    switch (roleNonFormatted) {
        case "user" :
            return "ROLE_USER";
        case "manager" :
            return "ROLE_MANAGER";
        case "admin" :
            return "ROLE_ADMIN";
    }
}

function getFormattedActive(activeNonFormatted) {
    if(activeNonFormatted == "true") {
        return true;
    }
    else {
        return false;
    }
}

function requestAndDisplayUserInfos() {
    if (!isUserInfosVisible) {
        if(!isUserInfosLoaded) {
            
            fetch("http://localhost:8090/api/user/username/" + username, {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token }
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
            isUserListLoaded = true;
            })
            .catch(err => {window.location.href="../html/error.html";})
            ;
            
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
        let buttonHtml = "<span class='button_little' onclick='deleteUser("  + idDB + ")'><p class='p_button_little'>Supprimer</p></span>"
        + "<span class='button_little' onclick='displayUser("  + idDB + ")><p class='p_button_little'>Editer</p></span>";
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

function deleteUser(id) { ///admin/delete/{id} DELETE mapping
    //console.log("clic sur supprimer");
    // faire requete
    fetch("http://localhost:8090/api/admin/delete/" + id, {
            method: "DELETE",
            headers: { 'Authorization': 'Bearer ' + token }
            //headers: {"Content-Type": "application/json"},  
            })
            .then(res => {
                resultElement = document.getElementById("result");
                resultElement.innerHTML = "";
                textButtonElement = document.getElementById("p_button_1");
                textButtonElement.innerText="Afficher la liste des Users";
                isUserListVisible = false;
                isUserListLoaded = false;
                alert("Suppression user ok : " + res.ok);
            })
            .catch(err => {
                //console.log('erreur requete : ' + err);
                window.location.href="../html/error.html";
            });

}

function displayUser(id) {

    // afficher et mise a jour booleen
    // si pas de modif rien

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