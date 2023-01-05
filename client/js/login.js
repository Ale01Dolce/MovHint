import { API_URL } from "./config";

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