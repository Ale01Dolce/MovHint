import { API_URL } from "./config.js";

function manageLogin() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            fetch(`${API_URL}/login/fb`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(response.authResponse)
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
        }
    });
}

fetch(`${API_URL}/userDetails`, {
    method: "GET",
    credentials: "include"
}).then(response => {
    console.log(response.status)
    if (!response.ok) {
        document.getElementById("login-navbar").textContent = "Log in"
        document.getElementById("login-navbar").setAttribute('href', 'login.html')
    } else {
        document.getElementById("login-navbar").textContent = "Logout"
        document.getElementById("login-navbar").setAttribute('href', 'logout.html')
        window.location.href = 'dashboard.html'
    }
})