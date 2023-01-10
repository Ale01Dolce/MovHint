import { API_URL } from "./config.js"

//Changing text and href based on user access
fetch(`${API_URL}/userDetails`, {
    method: "GET",
    headers: { token: localStorage.getItem('token') }
}).then(response => {
    console.log(response.status)
    if (!response.ok) { //If user is NOT logged in
        document.getElementById("login-navbar").textContent = "Log In"
        document.getElementById("login-navbar").setAttribute('href', 'login.html')
    } else {    //If user is logged in
        document.getElementById("login-navbar").textContent = "Log Out"
        document.getElementById("login-navbar").setAttribute('href', 'logout.html')

        document.getElementById("getstarted_button").setAttribute('href', 'questionary.html')
    }
})