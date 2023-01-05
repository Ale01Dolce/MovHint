import { API_URL } from "./config.js";
fetch(`${API_URL}/logout`, {

    method: "POST",
    credentials: "include"

}).then(response => {
    if (response.redirected) {
        window.location.href = response.url;
    }
})