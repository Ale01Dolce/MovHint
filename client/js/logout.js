import { API_URL } from "./config.js";
fetch(`${API_URL}/logout`, {

    method: "POST",
    credentials: "include"

}).then(response => {
    if (response.ok) {
        window.location.href = "index.html";
    } else {
        window.location.href = "login.html";
    }
})