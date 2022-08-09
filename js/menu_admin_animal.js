const username = sessionStorage.getItem("username");
const token = sessionStorage.getItem("authtoken");
//const id = sessionStorage.getItem("id");

function init() {
    usernameElement = document.getElementById("span_username");
    tokenElement = document.getElementById("p_token");
    usernameElement.innerText = username;
    tokenElement.innerText = token;
    console.log("username :", username);
    console.log("token :", token);
}