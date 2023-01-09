import { API_URL } from "./config.js"

//COMMENT
fetch(`${API_URL}/userDetails`, {
    method: "GET",
    credentials: "include"
}).then(response => {
    console.log(response.status)
    if (!response.ok) {
        document.getElementById("login-navbar").textContent = "Log In"
        document.getElementById("login-navbar").setAttribute('href', 'login.html')
    } else {
        document.getElementById("login-navbar").textContent = "Log Out"
        document.getElementById("login-navbar").setAttribute('href', 'logout.html')

        document.getElementById("getstarted_button").setAttribute('href', 'questionary.html')
    }
})