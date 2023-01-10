import { API_URL } from "./config.js";

//Changing href based on user access
fetch(`${API_URL}/logout`, {

    method: "POST",
    headers: {token: localStorage.getItem('token')}

}).then(response => {
    if (response.ok) {
        localStorage.removeItem('token')
        window.location.href = "index.html";
    } else {
        window.location.href = "login.html";
    }
})