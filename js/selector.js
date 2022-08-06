const username = sessionStorage.getItem("username");
const token = sessionStorage.getItem("authtoken");
var roleData;

function init() {
    // fais requete pour obtenir le role de l'user

    fetch("http://localhost:8090/api/user/role/" + username, {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token },
            //headers: {"Content-Type": "application/json"},  
            })
            .then(res => res.json())
            .then(data => {
            roleData = data;
            redirectByRole(roleData);
            })
            .catch(err => {window.location.href="../html/error.html";})
            ;
    // selon role envoie sur la bonne page
}

function redirectByRole(data) {
    let roleId = data.id;
    console.log("role : " + role);
    switch (roleId) {
        case 1 :
            window.location.href="../html/menu_admin.html";
        break;
        case 2 :
            window.location.href="../html/menu_manager.html";
        break;
        case 3 :
            window.location.href="../html/menu_user.html";
        break;
    };
}