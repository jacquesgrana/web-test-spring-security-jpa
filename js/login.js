var isPasswordHidden = true;

function init() {
    sessionStorage.clear();
}

function togglePassword() {
    let inputPassword = document.getElementById("password");
    let spanEye = document.getElementById("span_eye");

    if(isPasswordHidden) {
        inputPassword.type = "text";
        isPasswordHidden = false;
        spanEye.style.backgroundColor = "rgb(47, 102, 206)";
    }
    else {
        inputPassword.type = "password";
        isPasswordHidden = true;
        spanEye.style.backgroundColor = "rgb(40, 73, 133)";
    }
}

function logRequest() {
    let usernameElement = document.getElementById("user_name");
    let passwordElement = document.getElementById("password");
    let usernameValue = usernameElement.value;
    let passwordValue = passwordElement.value;
    const contentHeader = {
        username: usernameValue,
        password: passwordValue
    };
    sessionStorage.setItem("username", usernameValue);

    //let data;
    
    fetch("http://localhost:8090/api/signin", {
        method: "POST",
        headers: {"Content-Type": "application/json"},  
        body: JSON.stringify(contentHeader)
      })
      .then(res => res.json())
      .then(data => {
        
        //console.log("data : ", data);
        if(data != null  && data.authToken != null) { // && data.authToken != null
            
            let token = data.authToken;
            //console.log("token : ", token);
            sessionStorage.setItem("authtoken", token);
            window.location.href="../html/menu_selector.html";
        }
        
        else {
           console.log("error data : ");
           window.location.href="../html/error.html";
        }
    })
    .catch(err => {window.location.href="../html/error.html";})
    ;
    
}