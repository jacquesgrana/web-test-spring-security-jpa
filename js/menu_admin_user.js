
var isUserListVisible = false;
var isUserListLoaded = false;

var isUserInfosVisible = false;
var isUserInfosLoaded = false;

var isAddUserVisible = false;

var isEditUserVisible = false;

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
}

// TODO modifier create et update pour la liste animals *****************************************************************

function editUser(idDB, usernameDB, activeDB, roleDB, animalsString) { //, animals
    // si pas de modif rien
    

    let divElement = document.getElementById("bloc_user_edit");
    let animals;
    let animalsStringInit = animalsString;
    let htmlAnimals = "";
    //let htmlAnimals = "";
    if (!isEditUserVisible) {
        
        if(animalsString != "[]") {
            animalsString = animalsString.replaceAll('|', '"');
            animals = JSON.parse(animalsString);
            console.log("animal 1 : " + animals[0].name)
            console.log("animals string : " + animalsString);

            htmlAnimals += "<ul class='ul_animals_list_user'>";
            for(let i=0; i<animals.length; i++) { // animalType
                htmlAnimals += "<li class='li_animals_list_user'>" 
                + "<span class='white_text'>" + animals[i].name + "</span> / " 
                + "<span class='orange_2_text'>" + animals[i].animalType.label + "</span> / " 
                + "<span class='white_text'>" + animals[i].genre.toLowerCase() + "</span> / " 
                + "<span class='orange_2_text'>" + animals[i].comment + "</span></li>";
            }
            htmlAnimals += "</ul>";
        }
        else {
            animals = null;
        }

        // TODO ajouter affichage des animaux
        let html = "";
        html += "<form id='form_user_add'>"
        
        + '<div class="champ_form" id="champ_id_edit">'
        + '<span class="label_edit">Id</label>'
        + '<span class="champ_edit" id="id_edit">'
        + idDB
        + '</span>'
        + '</div>'
        + '<div class="champ_form" id="champ_username_edit">'
        + '<span class="label_edit">Username</label>'
        + '<span class="champ_edit" id="username_edit">'
        + usernameDB
        + '</span>'
        + '</div>'
        + '<div class="champ_form" id="champ_password_edit">'
        + '<label for="password">Password</label>'
        + '<input class="input" type="text" id="password_edit" name="password">'
        + '</div>';
        html += htmlAnimals;
        html +='<div class="champ_form" id="champ_active">'
        + '<label for="active">Active</label>'
        + '<input type= "radio" class="radio_user_add" id="true_radio_edit" name="active_edit" value="true" checked><span class= "text_radio_user_add">Oui</span>'
        + '<input type= "radio" class="radio_user_add" id="false_radio_edit" name="active_edit" value="false"><span class= "text_radio_user_add">Non</span>'
        + '</div>'
        + '<div class="champ_form" id="champ_role">'
        + '<label for="role">Role</label>'
        + '<input type="radio" class="radio_user_add" id="user_radio_edit" name="role_edit" value="user" checked><span class= "text_radio_user_add">User</span>'
        + '<input type="radio" class="radio_user_add" id="manager_radio_edit" name="role_edit" value="manager"><span class= "text_radio_user_add">Manager</span>'
        + '<input type="radio" class="radio_user_add" id="admin_radio_edit" name="role_edit" value="admin"><span class= "text_radio_user_add">Admin</span>'
        + '</div>'
        + '<div class="champ_form" id="bloc_button_user_update">'
        + '<button class="button" type="button" onclick=\'updateUserRequest(' + idDB  + ', "' + usernameDB + '", "' + animalsStringInit + '" )\'>Mettre ?? jour cet user</button>'
        + '<button class="button" type="reset">Effacer</button>'
        + '</div>'

        + "</form>";

        divElement.innerHTML = html;


        // TODO factoriser

        if(activeDB == "true") {
            document.getElementById("true_radio_edit").checked = true;
            document.getElementById("false_radio_edit").checked = false;
        }
        else {
            document.getElementById("true_radio_edit").checked = false;
            document.getElementById("false_radio_edit").checked = true;
        }


        switch (roleDB) {
            case "User" :
            document.getElementById("user_radio_edit").checked = true;
            document.getElementById("manager_radio_edit").checked = false;
            document.getElementById("admin_radio_edit").checked = false;
            break;
            case "Manager" :
            document.getElementById("user_radio_edit").checked = false;
            document.getElementById("manager_radio_edit").checked = true;
            document.getElementById("admin_radio_edit").checked = false;
            break;
            case "Admin" :
            document.getElementById("user_radio_edit").checked = false;
            document.getElementById("manager_radio_edit").checked = false;
            document.getElementById("admin_radio_edit").checked = true;
            break;
        }

        isEditUserVisible = true;
    }
    else {
        divElement.innerHTML = "";
        isEditUserVisible = false;
    }
}

function updateUserRequest(idDB, usernameDB, animalsString) {
    //idDb = 
    // a faire avant la requete
    //let usernameDB = document.getElementById("username_edit").value;
    let passwordDB = document.getElementById("password_edit").value;
    let activeDB = document.querySelector('input[name="active_edit"]:checked').value;
    let roleDB = document.querySelector('input[name="role_edit"]:checked').value;

    let activeFormatted = getFormattedActive(activeDB);
    let roleFormatted = getFormattedRole(roleDB.toLowerCase());
    let idRole = getRoleId(roleDB.toLowerCase());

    let animalsStringOk = animalsString.replaceAll('|', '"');

    console.log("function updateUserRequest :");
    console.log("idDB :", idDB);
    console.log("usernameDB :", usernameDB);
    console.log("passwordDB :", passwordDB);
    console.log("activeDB :", activeFormatted);
    console.log("roleDB :", roleFormatted);
    console.log("idRole :", idRole);
    console.log("animalsString :", animalsStringOk);

    // faire requete PUT
    const animals = JSON.parse(animalsStringOk);

    //console.log("animals : " + animals)

    if(passwordDB != "") {
        const roleContent = {
            id: idRole,
            label: roleFormatted
        };
    
        const contentHeader = {
            id: idDB,
            userName: usernameDB,
            password: passwordDB,
            active: activeFormatted,
            role: roleContent,
            animals: animals
        };

        console.log("password ok et objet contentHeader cr????");

        
        fetch("http://localhost:8090/api/admin/update/" + idDB, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(contentHeader)
        })
        .then(res => {
            closeDivListUSer();
            isUserListLoaded = false;
            document.getElementById("bloc_user_edit").innerHTML = "";
            isEditUserVisible = false;
            alert("Update user ok : " + res.ok);
        })
        .catch(err => {
            //console.log('erreur requete : ' + err);
            window.location.href="../html/error.html";
        });
 
    }
    else {
        console.log("password vide");
    }
    
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
        + '<button class="button" type="button" onclick="createUserRequest()">Cr??er user</button>'
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

// TODO modifier create et update pour la liste animals

function createUserRequest() { // localhost:8090/api/admin/create
    // r??cup??rer donn??es du formulaire
    let usernameElement = document.getElementById("username");
    let passwordElement = document.getElementById("password");
    let activeElement = document.querySelector('input[name="active"]:checked');
    let roleElement = document.querySelector('input[name="role"]:checked');
    let usernameValue = usernameElement.value;
    let passwordValue = passwordElement.value;
    let activeNonFormatted = activeElement.value;
    let roleNonFormatted = roleElement.value;

    // formatter les donn??es
    let activeValue = getFormattedActive(activeNonFormatted);
    let roleValue = getFormattedRole(roleNonFormatted);
    let roleId = getRoleId(roleNonFormatted);

   // tester donn??es
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

    // TODO modifier create et update pour la liste animals
    const contentHeader = {
        userName: usernameValue,
        password: passwordValue,
        active: activeValue,
        role: roleContent,
        animals: []
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
        closeDivListUSer();
        /*
        resultElement = document.getElementById("result");
        resultElement.innerHTML = "";
        textButtonElement = document.getElementById("p_button_1");
        textButtonElement.innerText="Afficher la liste des Users";
        isUserListVisible = false;
        */
        resultElement = document.getElementById("bloc_user_add");
        resultElement.innerHTML = "";
        textButtonElement = document.getElementById("p_button_2");
        textButtonElement.innerText="Ajouter un user";
        isAddUserVisible = false;
        isUserListLoaded = false;

        document.getElementById("bloc_user_edit").innerHTML = "";
        isEditUserVisible = false;
        alert("Ajout user ok : " + res.ok);
    })
    .catch(err => {
        //console.log('erreur requete : ' + err);
        window.location.href="../html/error.html";
    });
}


// TODO afficher la liste des animaux
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
        document.getElementById("bloc_user_edit").innerHTML = "";
        isEditUserVisible = false;
    }
}

// TODO afficher la liste des animaux
function displayUserInfos(data) {
    let html = "";
    let idDB = data.id;
    let password = data.password;
    let active = data.active;
    let role = getRoleValue(data.role.label);
    let classNameActive = getClassActive(active);
    let classNameRole = getClassRole(data.role.label);
    let animals =data.animals;
    
    html += "<p>Id : <span class='orange_text'>" + idDB + "</span></p>";
    html += "<p>Username : <span class='orange_text'>" + username + "</span></p>";
    html += "<p>Password : <span id='password_info'>" + password + "</span></p>";
    html += "<p>Active : <span class='" + classNameActive + "'>" + active + "</span></p>";
    html += "<p>R??le : <span class='" + classNameRole + "'>" + role + "</span></p>";
    if(animals.length > 0) {
        //console.log("animals : " + animals[0].name);
        html += "<ul class='ul_animals_list_user'>";
            for(let i=0; i<animals.length; i++) { // animalType
                html += "<li class='li_animals_list_user'>" 
                + "<span class='white_text'>" + animals[i].name + "</span> / " 
                + "<span class='orange_2_text'>" + animals[i].animalType.label + "</span> / " 
                + "<span class='white_text'>" + animals[i].genre.toLowerCase() + "</span> / " 
                + "<span class='orange_2_text'>" + animals[i].comment + "</span></li>"
            }
            html += "</ul>";
    }
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
            .catch(err => {window.location.href="../html/error.html";}) // window.location.href="../html/error.html"; *************************************************************************
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
        closeDivListUSer();
        /*
        resultElement = document.getElementById("result");
        resultElement.innerHTML = "";
        textButtonElement = document.getElementById("p_button_1");
        textButtonElement.innerText="Afficher la liste des Users";
        isUserListVisible = false;
        */
        document.getElementById("bloc_user_edit").innerHTML = "";
        isEditUserVisible = false;
    }
}

// TODO modifier create et update pour la liste animals ******************************
function displayUserList(data) {
    resultElement = document.getElementById("result");
    let string ="<ul>";
    for (let i=0; i<data.length; i++) {
        let usernameDB = data[i].userName;

        let animals= data[i].animals;
        let animalsString = JSON.stringify(animals);
        animalsString = animalsString.replaceAll('"', '|');
        let htmlAnimals = "";
        //console.log("animals :" + animalsString);

        // TODO faire fonction
        if(animalsString != "[]") {
            htmlAnimals += "<ul class='ul_animals_list_user'>";
            for(let i=0; i<animals.length; i++) { // animalType
                htmlAnimals += "<li class='li_animals_list_user'>" 
                + "<span class='white_text'>" + animals[i].name + "</span> / " 
                + "<span class='orange_2_text'>" + animals[i].animalType.label + "</span> / " 
                + "<span class='white_text'>" + animals[i].genre.toLowerCase() + "</span> / " 
                + "<span class='orange_2_text'>" + animals[i].comment + "</span></li>";
            }
            htmlAnimals += "</ul>";
        }

        let idDB = data[i].id;
        let active = data[i].active;
        let role = data[i].role.label;
        let classNameActive = getClassActive(active);
        let roleValue = getRoleValue(role);
        let classNameRole = getClassRole(role);

        let classNameUsername = "white_text";
        let isUserLogged = (usernameDB == username);
        let buttonHtml = "<span class='button_little' onclick='deleteUser("  + idDB + ")'><p class='p_button_little'>Supprimer</p></span>"
        + "<span class='button_little' onclick='editUser("  
        + idDB + ', "'
        + usernameDB + '", "'
        + active + '", "'
        + roleValue + '", "'
        + animalsString + '"'
        + ")'><p class='p_button_little'>Editer</p></span>";
        if(isUserLogged) {
            buttonHtml = "<span class='button_little_disabled'><p class='p_button_little'>Supprimer</p></span>"
            + "<span class='button_little_disabled'><p class='p_button_little'>Editer</p></span>";
            classNameUsername = "orange_text";
        }

        string += "<li class='li_user_list'><article id='article_user_list'>" + idDB 
        + " : <span class='" + classNameUsername + "'>" + usernameDB 
        + "</span> : <span class=\"" + classNameActive + "\">" + active 
        + "</span> : <span class=\"" + classNameRole + "\">" + roleValue 
        + "</span>" 
        + buttonHtml
        //********************************************************* ajouter animals ici? */
        
        + "</article>" 
        + htmlAnimals
        + "</li>";
        //console.log(string);
    }
    string += "</ul>";
    resultElement.innerHTML = string;
}

function deleteUser(id) { ///admin/delete/{id} DELETE mapping
    //console.log("clic sur supprimer");
    // faire requete

    // TODO faire message de confirmation
    
    // si ok faire requete sinon rien

    fetch("http://localhost:8090/api/admin/delete/" + id, {
            method: "DELETE",
            headers: { 'Authorization': 'Bearer ' + token }
            //headers: {"Content-Type": "application/json"},  
            })
            .then(res => {
                closeDivListUSer();
                /*
                resultElement = document.getElementById("result");
                resultElement.innerHTML = "";
                textButtonElement = document.getElementById("p_button_1");
                textButtonElement.innerText="Afficher la liste des Users";
                isUserListVisible = false;
                */
                document.getElementById("bloc_user_edit").innerHTML = "";
                isEditUserVisible = false;
                isUserListLoaded = false;
                alert("Suppression user ok : " + res.ok);
            })
            .catch(err => {
                //console.log('erreur requete : ' + err);
                window.location.href="../html/error.html";
            });

}

function closeDivListUSer() {
    resultElement = document.getElementById("result");
    resultElement.innerHTML = "";
    textButtonElement = document.getElementById("p_button_1");
    textButtonElement.innerText="Afficher la liste des Users";
    isUserListVisible = false;
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