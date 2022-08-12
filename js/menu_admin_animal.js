const username = sessionStorage.getItem("username");
const token = sessionStorage.getItem("authtoken");
//const id = sessionStorage.getItem("id");

var isAnimalListVisible = false;
var isAnimalListLoaded = false;

var isAddAnimalVisible = false;

var dataAnimalList;
var dataAnimalTypeList;

// TODO medifier texte des boutons selon les cas !!

function init() {
    doRequestAnimalTypeList();
    //console.log("data animal type : " + JSON.stringify(dataAnimalTypeList));
    usernameElement = document.getElementById("span_username");
    tokenElement = document.getElementById("p_token");
    usernameElement.innerText = username;
    tokenElement.innerText = token;
    //console.log("username :", username);
    //console.log("token :", token);
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
            .catch(err => {window.location.href="../html/error.html";})
            ;
}

function doRequestCreateAnimal() {
    let nameElement = document.getElementById("name");
    let commentElement = document.getElementById("comment");
    let genreElement = document.querySelector('input[name="genre"]:checked');
    let typeElement = document.getElementById("select_type");
    let birthElement = document.getElementById("birth");
    
    let nameValue = nameElement.value;
    let commentValue = commentElement.value;
    let genreValue = genreElement.value;
    let typeNonFormatted = typeElement.options[typeElement.selectedIndex].value;
    let typeId = parseInt(typeNonFormatted, 10);
    let typeValue = getAnimalTypeLabelFromId(typeId);
    
    let birthValue = birthElement.value;

    // recuperer index et libelle du type
    console.log("nameValue", nameValue);
    console.log("commentValue", commentValue);
    console.log("genreValue", genreValue);
    console.log("typeId", typeId);
    console.log("birthValue", birthValue);
    console.log("typeValue", typeValue);



    /*
    {
    "animalType": {
            "id": 1,
            "label": "Chat"
        },
        "name": "tito",
        "comment": "Chat seul",
        "genre": "MALE",
        "birth": "2018-04-12"
  }
    */

  const typeContent = {
    id: typeId,
    label: typeValue
};

// TODO modifier create et update pour la liste animals
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
        
        isAnimalListLoaded = false;
        let divBlocAnimalListElt = document.getElementById("bloc_animal_list");
        divBlocAnimalListElt.innerHTML = "";
        isAnimalListVisible = false;
        let divBlocAnimalAddElt = document.getElementById("bloc_animal_add");
        divBlocAnimalAddElt.innerHTML = "";
        isAddAnimalVisible = false;
        
        alert("Ajout animal ok : " + res.ok);

    })
    .catch(err => {
        //console.log('erreur requete : ' + err);
        window.location.href="../html/error.html";
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
    let htmlSelectType = "<select name='type' id='select_type'>";
    for(let i=0; i<dataAnimalTypeList.length; i++) {
        htmlSelectType += "<option class='option_select_type' value ='" + dataAnimalTypeList[i].id + "'>";
        htmlSelectType += dataAnimalTypeList[i].label;
        htmlSelectType += "</option>";
    }

    htmlSelectType += "</select>";
    ;
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
        + '<button class="button" type="button" onclick="doRequestCreateAnimal()">Créer animal</button>'
        + '<button class="button" type="reset">Effacer</button>'
        + '</div>';

    html += "</form>";
    return html;
}

function getAnimalTypeLabelFromId(typeId) {
    let libelle = "";
    libelle = dataAnimalTypeList.filter(t => t.id == typeId).map(t => t.label)[0];
    return libelle;
}
