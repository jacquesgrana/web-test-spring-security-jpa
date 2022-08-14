const username = sessionStorage.getItem("username");
const token = sessionStorage.getItem("authtoken");
//const id = sessionStorage.getItem("id");

var isAnimalListVisible = false;
var isAnimalListLoaded = false;

var isAddAnimalVisible = false;

var isEditAnimalVisible = false;

var dataAnimalList;
var dataAnimalTypeList;
var dataUserList;

// TODO modifier texte des boutons selon les cas
// TODO ajouter requete pour charger la liste des users

function init() {
    doRequestAnimalTypeList();
    doRequestUserList();
    //console.log("data animal type : " + JSON.stringify(dataAnimalTypeList));
    usernameElement = document.getElementById("span_username");
    tokenElement = document.getElementById("p_token");
    usernameElement.innerText = username;
    tokenElement.innerText = token;
    //console.log("username :", username);
    //console.log("token :", token);
}

// ************************** fonctions appelées par des boutons

function requestAndDisplayAnimalList() {
    let divBlocAnimalListElt = document.getElementById("bloc_animal_list");
    if (!isAnimalListVisible) {
        if (!isAnimalListLoaded) {
            console.log("requete get liste animaux");
            doRequestAnimalListAndDisplay();
            //displayAnimalList(dataAnimalList);
            isAnimalListLoaded = true;
        }
        else {
            //console.log("data : " + dataAnimalList);
            displayAnimalList(dataAnimalList);
        }
        //displayAnimalList(dataAnimalList);
        isAnimalListVisible = true;
    }
    else {
        divBlocAnimalListElt.innerHTML = "";
        isAnimalListVisible = false;
    }

}

function displayAddAnimal() {
    let divBlocAnimalAddElt = document.getElementById("bloc_animal_add");
    if (!isAddAnimalVisible) {

        divBlocAnimalAddElt.innerHTML = getAddAnimalDivHtml();
        isAddAnimalVisible = true;
    }
    else {
        divBlocAnimalAddElt.innerHTML = "";
        isAddAnimalVisible = false;
    }
}

function displayEditAnimal(id) {
    let element = document.getElementById("bloc_animal_edit");

    if (!isEditAnimalVisible) {
        element.innerHTML = getEditAnimalDivHtml(id);
        isEditAnimalVisible = true;
    }
    else {
        element.innerHTML = "";
        isEditAnimalVisible = false;
    }
}

// ************************** fonctions executant des requetes vers le serveur

function doRequestUserList() {
    fetch("http://localhost:8090/api/user/all", {
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + token },
        //headers: {"Content-Type": "application/json"},  
    })
        .then(res => res.json())
        .then(data => {
            //console.log("data animal type : " + JSON.stringify(data));
            dataUserList = data;
        })
        .catch(err => { window.location.href = "../html/error.html"; })
        ;
}

function doRequestAnimalTypeList() {
    fetch("http://localhost:8090/api/animaltype/all", {
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + token },
        //headers: {"Content-Type": "application/json"},  
    })
        .then(res => res.json())
        .then(data => {
            //console.log("data animal type : " + JSON.stringify(data));
            dataAnimalTypeList = data;
        })
        .catch(err => { window.location.href = "../html/error.html"; })
        ;
}

function doRequestUpdateAnimal(idUserOldString, idAnimal) {
    let idUserOld = null;
    if (idUserOldString != "Aucun") {
        idUserOld = parseInt(idUserOldString, 10);
    }
    //console.log("idUserOldString", idUserOldString);

    let nameElement = document.getElementById("name_update");
    let commentElement = document.getElementById("comment_update");
    let genreElement = document.querySelector('input[name="genre"]:checked');
    let typeElement = document.getElementById("select_type_update");
    let birthElement = document.getElementById("birth_update");
    let userElement = document.getElementById("select_user_update");

    let nameValue = nameElement.value;
    let commentValue = commentElement.value;
    let genreValue = genreElement.value;
    let typeNonFormatted = typeElement.options[typeElement.selectedIndex].value;
    let typeId = parseInt(typeNonFormatted, 10);
    let typeValue = getAnimalTypeLabelFromId(typeId);
    let userNonFormatted = userElement.options[userElement.selectedIndex].value;
    let userId;
    if (userNonFormatted == "nothing") {
        userId = null;
    }
    else {
        userId = parseInt(userNonFormatted, 10);
    }


    let birthValue = birthElement.value;

    // recuperer index et libelle du type
    console.log("idAnimal", idAnimal);
    console.log("nameValue", nameValue);
    console.log("commentValue", commentValue);
    console.log("genreValue", genreValue);
    console.log("birthValue", birthValue);
    console.log("typeId", typeId);
    console.log("typeValue", typeValue);
    console.log("userNonFormatted", userNonFormatted);
    console.log("userId", userId);
    console.log("idUserOld", idUserOld);

    const typeContent = {
        id: typeId,
        label: typeValue
    };

    const contentHeader = {
        id: idAnimal,
        animalType: typeContent,
        name: nameValue,
        comment: commentValue,
        genre: genreValue,
        birth: birthValue
    };


    fetch("http://localhost:8090/api/animal/update/" + idAnimal, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        //headers: {"Content-Type": "application/json"},  
        body: JSON.stringify(contentHeader)
    })
        .then(res => {
            doRequestUserList();
            closeAllDiv();
            isAnimalListLoaded = false;
            /*
            isAnimalListLoaded = false;
            let divBlocAnimalListElt = document.getElementById("bloc_animal_list");
            divBlocAnimalListElt.innerHTML = "";
            isAnimalListVisible = false;
            let divBlocAnimaleDITElt = document.getElementById("bloc_animal_edit");
            divBlocAnimaleDITElt.innerHTML = "";
            isEditAnimalVisible = false;
            let divBlocAnimalAddElt = document.getElementById("bloc_animal_add");
            divBlocAnimalAddElt.innerHTML = "";
            isAddAnimalVisible = false;
            */
            alert("Update animal ok : " + res.ok);
        })
        .catch(err => {
            //console.log('erreur requete : ' + err);
            window.location.href = "../html/error.html";
        })
        ;


    if (idUserOld != null && userId != null && idUserOld != userId) {
        doRequestUnlinkUserToAnimal(idUserOld, idAnimal);
    }

    if (idUserOld != null && userId == null) {
        doRequestUnlinkUserToAnimal(idUserOld, idAnimal);
    }

    if (userId != null && idUserOld != userId) {
        doRequestLinkUserToAnimal(userId, idAnimal);
    }
}

function doRequestUnlinkUserToAnimal(idUserOld, idAnimal) {
    //console.log("unlink : " + idUserOld + " : " + idAnimal );
    const contentHeader = {
        "idUSer": idUserOld,
        "idAnimal": idAnimal
    };
    fetch("http://localhost:8090/api/admin/user/unlink/animal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        //headers: {"Content-Type": "application/json"},  
        body: JSON.stringify(contentHeader)
    })
        .then(res => {
            alert("Unlink animal ok : " + res.ok);
        })
        .catch(err => {
            //console.log('erreur requete : ' + err);
            window.location.href = "../html/error.html";
        })
        ;
}

function doRequestLinkUserToAnimal(userId, idAnimal) {
    //console.log("link : " + userId + " : " + idAnimal );
    const contentHeader = {
        "idUSer": userId,
        "idAnimal": idAnimal
    };
    fetch("http://localhost:8090/api/admin/user/link/animal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        //headers: {"Content-Type": "application/json"},  
        body: JSON.stringify(contentHeader)
    })
        .then(res => {
            alert("Link animal ok : " + res.ok);
        })
        .catch(err => {
            //console.log('erreur requete : ' + err);
            window.location.href = "../html/error.html";
        })
        ;
}

function doRequestCreateAnimal() {
    // TODO ajouter requete pour affecter le maitre apres la requete de creation de l'animal
    let nameElement = document.getElementById("name");
    let commentElement = document.getElementById("comment");
    let genreElement = document.querySelector('input[name="genre"]:checked');
    let typeElement = document.getElementById("select_type");
    let birthElement = document.getElementById("birth");
    //let userElement = document.getElementById("select_user");

    let nameValue = nameElement.value;
    let commentValue = commentElement.value;
    let genreValue = genreElement.value;
    let typeNonFormatted = typeElement.options[typeElement.selectedIndex].value;
    let typeId = parseInt(typeNonFormatted, 10);
    let typeValue = getAnimalTypeLabelFromId(typeId);
    //let userNonFormatted = userElement.options[userElement.selectedIndex].value;
    //let userId = parseInt(userNonFormatted, 10);

    let birthValue = birthElement.value;

    // recuperer index et libelle du type
    console.log("nameValue", nameValue);
    console.log("commentValue", commentValue);
    console.log("genreValue", genreValue);
    console.log("birthValue", birthValue);
    console.log("typeId", typeId);
    console.log("typeValue", typeValue);
    //console.log("userId", userId);

    const typeContent = {
        id: typeId,
        label: typeValue
    };

    const contentHeader = {
        animalType: typeContent,
        name: nameValue,
        comment: commentValue,
        genre: genreValue,
        birth: birthValue
    };

    fetch("http://localhost:8090/api/animal/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        //headers: {"Content-Type": "application/json"},  
        body: JSON.stringify(contentHeader)
    })
        .then(res => {
            closeAllDiv();
            isAnimalListLoaded = false;
            /*
            let divBlocAnimalListElt = document.getElementById("bloc_animal_list");
            divBlocAnimalListElt.innerHTML = "";
            isAnimalListVisible = false;
            let divBlocAnimaleDITElt = document.getElementById("bloc_animal_edit");
            divBlocAnimaleDITElt.innerHTML = "";
            isEditAnimalVisible = false;
            let divBlocAnimalAddElt = document.getElementById("bloc_animal_add");
            divBlocAnimalAddElt.innerHTML = "";
            isAddAnimalVisible = false;
            */
            alert("Ajout animal ok : " + res.ok);
        })
        .catch(err => {
            //console.log('erreur requete : ' + err);
            window.location.href = "../html/error.html";
        })
        ;
}

function doRequestAnimalListAndDisplay() {
    fetch("http://localhost:8090/api/animal/all", {
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + token },
        //headers: {"Content-Type": "application/json"},  
    })
        .then(res => res.json())
        .then(data => {
            //console.log("data 1 : " + data);
            dataAnimalList = data;
            displayAnimalList(dataAnimalList);
            //return data;
        })
        .catch(err => { window.location.href = "../html/error.html"; })
        ;
}

function doRequestDeleteAnimal(idAnimal) {
    //console.log("requete suppression animal id : " + idAnimal);

    fetch("http://localhost:8090/api/animal/delete/" + idAnimal, {
        method: "DELETE",
        headers: { 'Authorization': 'Bearer ' + token }
        //headers: {"Content-Type": "application/json"},  
    })
        .then(res => {
            doRequestUserList();
            closeAllDiv();
            /*
            isAnimalListLoaded = false;
            let divBlocAnimalListElt = document.getElementById("bloc_animal_list");
            divBlocAnimalListElt.innerHTML = "";
            isAnimalListVisible = false;
            let divBlocAnimaleDITElt = document.getElementById("bloc_animal_edit");
            divBlocAnimaleDITElt.innerHTML = "";
            isEditAnimalVisible = false;
            let divBlocAnimalAddElt = document.getElementById("bloc_animal_add");
            divBlocAnimalAddElt.innerHTML = "";
            isAddAnimalVisible = false;
            */
            alert("Suppression animal ok : " + res.ok);
        })
        .catch(err => {
            //console.log('erreur requete : ' + err);
            window.location.href = "../html/error.html";
        });


}


// ************************** fonctions d'affichages

function displayAnimalList(data) {
    let element = document.getElementById("bloc_animal_list");
    let html = "<ul>";
    for (let i = 0; i < data.length; i++) {
        //html += "<li>" + data[i].id + " / " + data[i].name + "</li>"; 
        html += "<li class='li_animals_list_user'>"
            + "<span class='orange_2_text'>" + data[i].id + "</span> / "
            + "<span class='white_text'>" + data[i].name + "</span> / "
            + "<span class='orange_2_text'>" + data[i].animalType.label + "</span> / "
            + "<span class='white_text'>" + data[i].genre.toLowerCase() + "</span>"
            //+ "<span class='orange_2_text'>" + data[i].comment + "</span>"
            + "<span class='button_little' onclick='displayEditAnimal(" + data[i].id + ")'><span class='p_button_little'>Editer</span></span>"
            + "<span class='button_little' onclick='deleteAnimal(" + data[i].id + ")'><span class='p_button_little'>Supprimer</span></span></li>"
            ;
    }
    html += "</ul>";
    //console.log("data 2 : " + data);
    element.innerHTML = html;
}

function getEditAnimalDivHtml(id) {
    let nameValue = dataAnimalList.filter(a => a.id == id).map(a => a.name)[0];
    let birthValue = dataAnimalList.filter(a => a.id == id).map(a => a.birth)[0];
    let typeIdValue = dataAnimalList.filter(a => a.id == id).map(a => a.animalType.id)[0];
    let typeLabelValue = dataAnimalList.filter(a => a.id == id).map(a => a.animalType.label)[0];
    let genreValue = dataAnimalList.filter(a => a.id == id).map(a => a.genre)[0];
    let commentValue = dataAnimalList.filter(a => a.id == id).map(a => a.comment)[0];

    // faire fonction qui recupere l'id de l'user maitre selon id de l'animal sinon renvoie null
    let userIdValue = getLinkedUserIdOrNone(id);

    let html = "";

    console.log('userIdValue', userIdValue);
    console.log('genreValue', genreValue);

    let htmlSelectType = "<select class='select_form' name='type' id='select_type_update'>";
    for (let i = 0; i < dataAnimalTypeList.length; i++) {
        let selectedTypeHtml = "";
        if (typeIdValue == dataAnimalTypeList[i].id) {
            selectedTypeHtml = "selected";
        }
        else {
            selectedTypeHtml = "";
        }

        htmlSelectType += "<option class='option_select_type' value ='" + dataAnimalTypeList[i].id + "' " + selectedTypeHtml + " >";
        htmlSelectType += dataAnimalTypeList[i].label;
        htmlSelectType += "</option>";
    }
    htmlSelectType += "</select>";

    let htmlNothingSelected = "";
    if (userIdValue == null) {
        htmlNothingSelected = "selected";
    }

    let htmlSelectUser = "<select class='select_form' name='user' id='select_user_update'>";
    htmlSelectUser += "<option class='option_select_user' value ='nothing' " + htmlNothingSelected + " >";
    htmlSelectUser += 'Aucun';
    htmlSelectUser += "</option>";

    for (let i = 0; i < dataUserList.length; i++) {
        let selectedUserHtml = "";
        if (userIdValue != null) {
            if (dataUserList[i].id == userIdValue) {
                selectedUserHtml = "selected";
            }
            else {
                selectedUserHtml = "";
            }
        }

        htmlSelectUser += "<option class='option_select_user' value ='" + dataUserList[i].id + "' " + selectedUserHtml + " >";
        htmlSelectUser += dataUserList[i].userName;
        htmlSelectUser += "</option>";
    }
    htmlSelectUser += "</select>";

    let selectedGenreMaleHtml = "";
    let selectedGenreFemaleHtml = "";

    if (genreValue == "MALE") {
        selectedGenreMaleHtml = "checked";
        selectedGenreFemaleHtml = "";
    }
    else {
        selectedGenreMaleHtml = "";
        selectedGenreFemaleHtml = "checked";
    }

    html += "<form id='form_user_update'>"
        + '<div class="champ_form" id="champ_id_update">'
        + '<span class="label_edit">Id</label>'
        + '<span class="champ_edit" id="id_edit">'
        + id
        + '</span>'
        + '</div>'

        + '<div class="champ_form" id="champ_name_update">'
        + '<label for="name">Name</label>'
        + '<input class="input" type="text" id="name_update" name="name" value="' + nameValue + '">'
        + '</div>'

        + '<div class="champ_form" id="champ_birth_update">'
        + '<label for="birth">Birth</label>'
        + '<input class="input" type="date" id="birth_update" name="birth" value="' + birthValue + '">' //birthValue
        + '</div>'

        + '<div class="champ_form" id="champ_type_update">'
        + '<label for="type">Type</label>'
        + htmlSelectType
        + '</div>'

        + '<div class="champ_form" id="genre_update">'
        + '<label for="genre">Genre</label>'
        + '<input type= "radio" class="radio_user_add" name="genre" value="MALE" ' + selectedGenreMaleHtml + ' ><span class= "text_radio_user_add">Mâle</span>'
        + '<input type= "radio" class="radio_user_add" name="genre" value="FEMALE" ' + selectedGenreFemaleHtml + ' ><span class= "text_radio_user_add">Femelle</span>'
        + '</div>'
        + '<div class="champ_form" id="champ_comment_update">'
        + '<label for="comment">Comment</label>'
        + '<input class="input" type="text" id="comment_update" name="comment" value="' + commentValue + '" >'
        + '</div>'
        // a ajouter a getEditAnimalDivHtml
        // ajouter select user avec les username
        + '<div class="champ_form" id="champ_user_update">'
        + '<label for="user">User</label>'
        + htmlSelectUser
        + '</div>'
        + '<div class="champ_form" id="bloc_button_user_update">'
        + '<button class="button" type="button" onclick="doRequestUpdateAnimal(\'' + userIdValue + '\',' + id + ')">Mettre à jour l\'animal</button>'
        + '<button class="button" type="reset">Effacer</button>'
        + '</div>';

    //+ "<span class='button_little' onclick='displayEditAnimal("  + data[i].id + ")'><span class='p_button_little'>Editer</span></span>"

    html += "</form>";
    return html;
}

function getAddAnimalDivHtml() {
    let html = "";
    let htmlSelectType = "<select name='type' id='select_type'>";

    for (let i = 0; i < dataAnimalTypeList.length; i++) {
        htmlSelectType += "<option class='option_select_type' value ='" + dataAnimalTypeList[i].id + "'>";
        htmlSelectType += dataAnimalTypeList[i].label;
        htmlSelectType += "</option>";
    }
    htmlSelectType += "</select>";
    /*
        let htmlSelectUser = "<select name='user' id='select_user'>";
        htmlSelectUser += "<option class='option_select_user' value ='nothing' selected>";
        htmlSelectUser += 'Aucun';
        htmlSelectUser += "</option>";
        for(let i=0; i<dataUserList.length; i++) {
            htmlSelectUser += "<option class='option_select_user' value ='" + dataUserList[i].id + "'>";
            htmlSelectUser += dataUserList[i].userName;
            htmlSelectUser += "</option>";
        }
        htmlSelectUser += "</select>";*/

    html += "<form id='form_user_add'>"
        + '<div class="champ_form" id="champ_name">'
        + '<label for="name">Name</label>'
        + '<input class="input" type="text" id="name" name="name">'
        + '</div>'

        + '<div class="champ_form" id="champ_birth">'
        + '<label for="birth">Birth</label>'
        + '<input class="input" type="date" id="birth" name="birth">'
        + '</div>'

        + '<div class="champ_form" id="champ_type">'
        + '<label for="type">Type</label>'
        + htmlSelectType
        + '</div>'

        + '<div class="champ_form" id="genre">'
        + '<label for="genre">Genre</label>'
        + '<input type= "radio" class="radio_user_add" name="genre" value="MALE" checked><span class= "text_radio_user_add">Mâle</span>'
        + '<input type= "radio" class="radio_user_add" name="genre" value="FEMALE"><span class= "text_radio_user_add">Femelle</span>'
        + '</div>'
        + '<div class="champ_form" id="champ_comment">'
        + '<label for="comment">Comment</label>'
        + '<input class="input" type="text" id="comment" name="comment">'
        + '</div>'
        // a ajouter a getEditAnimalDivHtml
        // ajouter select user avec les username
        //   + '<div class="champ_form" id="champ_user">'
        //    + '<label for="user">User</label>'
        //    + htmlSelectUser
        //   + '</div>'
        + '<div class="champ_form" id="bloc_button_user_add">'
        + '<button class="button" type="button" onclick="doRequestCreateAnimal()">Créer animal</button>'
        + '<button class="button" type="reset">Effacer</button>'
        + '</div>';

    html += "</form>";
    return html;
}

// ************************** fonctions diverses

function closeAllDiv() {
    let divBlocAnimalListElt = document.getElementById("bloc_animal_list");
    divBlocAnimalListElt.innerHTML = "";
    isAnimalListVisible = false;
    let divBlocAnimaleDITElt = document.getElementById("bloc_animal_edit");
    divBlocAnimaleDITElt.innerHTML = "";
    isEditAnimalVisible = false;
    let divBlocAnimalAddElt = document.getElementById("bloc_animal_add");
    divBlocAnimalAddElt.innerHTML = "";
    isAddAnimalVisible = false;
}

function deleteAnimal(idAnimal) {
    if (confirm("Voulez-vous supprimer cet animal id : " + idAnimal + "?")) {
        doRequestDeleteAnimal(idAnimal);
    }
}

function getAnimalTypeLabelFromId(typeId) {
    let libelle = "";
    libelle = dataAnimalTypeList.filter(t => t.id == typeId).map(t => t.label)[0];
    return libelle;
}

function getLinkedUserIdOrNone(animalId) {
    //let userId = null;
    //let userId = dataUserList.filter(u => u.animals.filter(a => a.id == animalId)).map(u => u.id)[0];

    for (let i = 0; i < dataUserList.length; i++) {
        if (dataUserList[i].animals.length != 0) {
            for (let j = 0; j < dataUserList[i].animals.length; j++) {
                if (dataUserList[i].animals[j].id == animalId) {
                    return dataUserList[i].id;
                }
            }
        }
    }
    return "Aucun";
}
/*

function getAnimalIdFromValues(nameValue, commentValue, genreValue, birthValue, typeId) {
    let id = null;
    id = dataAnimalList.filter(a => 
        a.name == nameValue 
        && a.comment == commentValue
        && a.genre == genreValue
        && a.birth == birthValue
        && a.animalType.id == typeId)
        .map(a => a.id)[0];
    return id;
}*/
