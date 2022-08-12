const username = sessionStorage.getItem("username");
const token = sessionStorage.getItem("authtoken");
//const id = sessionStorage.getItem("id");

var isAnimalListVisible = false;
var isAnimalListLoaded = false;

var isAddAnimalVisible = false;

var dataAnimalList;
// ajouter var dateAnimalTypeList;

function init() {
    // TODO ajouter requete pour charger la liste des types des animaux
    usernameElement = document.getElementById("span_username");
    tokenElement = document.getElementById("p_token");
    usernameElement.innerText = username;
    tokenElement.innerText = token;
    console.log("username :", username);
    console.log("token :", token);
}

function requestAndDisplayAnimalList() {
    let divBlocAnimalListElt = document.getElementById("bloc_animal_list");
    if (!isAnimalListVisible) {
        if (!isAnimalListLoaded) { 
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
            .catch(err => {window.location.href="../html/error.html";})
            ;
}

function displayAnimalList(data) {
    let element = document.getElementById("bloc_animal_list");
    let html = "<ul>";
    for(let i=0; i<data.length; i++) {
        //html += "<li>" + data[i].id + " / " + data[i].name + "</li>"; 
        html += "<li class='li_animals_list_user'>" 
        + "<span class='orange_2_text'>" + data[i].id + "</span> / " 
        + "<span class='white_text'>" + data[i].name + "</span> / " 
        + "<span class='orange_2_text'>" + data[i].animalType.label + "</span> / " 
        + "<span class='white_text'>" + data[i].genre.toLowerCase() + "</span> / " 
        + "<span class='orange_2_text'>" + data[i].comment + "</span></li>"
        ;
    }
    html += "</ul>";
    //console.log("data 2 : " + data);
    element.innerHTML = html;
}

function getAddAnimalDivHtml() {
    let html = "";
    let htmlSelectType = "<select name='type' id='select_type'>"
    + "<option class='option_select_type' value =1>Chat</option>"
    + "<option class='option_select_type' value =2>Chien</option>"
    + "<option class='option_select_type' value =3>Poisson</option>"
    + "</select>";
    ;
    html += "<form id='form_user_add'>"
        + '<div class="champ_form" id="champ_name">'
        + '<label for="name">Name</label>'
        + '<input class="input" type="text" id="name" name="name">'
        + '</div>'
        + '<div class="champ_form" id="champ_type">'
        + '<label for="type">Type</label>'
        + htmlSelectType
        + '</div>'
        // ajouter choix animal type (faire requête en début de fonction)
        + '<div class="champ_form" id="genre">'
        + '<label for="genre">Genre</label>'
        + '<input type= "radio" class="radio_user_add" name="genre" value="MALE" checked><span class= "text_radio_user_add">Mâle</span>'
        + '<input type= "radio" class="radio_user_add" name="genre" value="FEMALE"><span class= "text_radio_user_add">Femelle</span>'
        + '</div>'
        + '<div class="champ_form" id="champ_comment">'
        + '<label for="comment">Comment</label>'
        + '<input class="input" type="text" id="comment" name="comment">'
        + '</div>'
        + '<div class="champ_form" id="bloc_button_user_add">'
        + '<button class="button" type="button" onclick="createUserRequest()">Créer animal</button>'
        + '<button class="button" type="reset">Effacer</button>'
        + '</div>';

    html += "</form>";
    return html;
}

