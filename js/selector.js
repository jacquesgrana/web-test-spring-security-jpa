const username = sessionStorage.getItem("username");
const token = sessionStorage.getItem("authtoken");

function init() {
    fetch("http://localhost:8090/api/user/role/" + username, {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token },  
            })
            .then(res => res.json())
            .then(data => {
            redirectByRoleId(data);
            })
            .catch(err => {window.location.href="../html/error.html";});
}

function redirectByRoleId(data) {
    let roleId = data.id;
    //console.log("id : " + roleId);
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