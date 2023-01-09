import { API_URL } from "./config.js"

let movie_item_template = ""
let userDetails = {}

const capitalize = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())

fetch(`${API_URL}/userDetails`, {
    method: "GET",
    credentials: "include"
}).then(response => {
    console.log(response.status)
    if (!response.ok) {
        document.getElementById("login-navbar").textContent = "Log In"
        document.getElementById("login-navbar").setAttribute('href', 'login.html')
        window.location.href = 'index.html'
    } else {
        document.getElementById("login-navbar").textContent = "Log Out"
        document.getElementById("login-navbar").setAttribute('href', 'logout.html')
        response.json().then((json) => {
            userDetails = json
            document.getElementById('welcome-text').innerText = `Welcome back, ${capitalize(userDetails.fullname, true)}!`

            fetch("html/movie_item.ejs")
                .then(r => r.text())
                .then((text) => {
                    movie_item_template = text
                    document.getElementById('movies-list').innerHTML = ''
                    for (const elem of userDetails.recommendations) {
                        console.log(elem)
                        document.getElementById('movies-list').innerHTML += ejs.render(movie_item_template, {movie: elem});
                    }

                })
        })
    }
}).catch(() => { window.location.href = 'index.html' })





