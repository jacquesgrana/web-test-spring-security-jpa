const username = sessionStorage.getItem("username");
const token = sessionStorage.getItem("authtoken");
//const id = sessionStorage.getItem("id");

var isAnimalListVisible = false;
var isAnimalListLoaded = false;

var isAddAnimalVisible = false;

var dataAnimalList;

function init() {
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

        divBlocAnimalAddElt.innerHTML = "<p>Test ok</p>";
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
            .catch(err => {window.location.href="../html/error.html";}) // window.location.href="../html/error.html"; *************************************************************************
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
    console.log("data 2 : " + data);
    element.innerHTML = html;
}

