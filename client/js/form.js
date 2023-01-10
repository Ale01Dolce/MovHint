/** @type {HTMLFormElement} */
import { API_URL } from "./config.js"

document.getElementById('form-preferences').addEventListener("submit", (event) => {

    //Takes all the form inputs, collects the various preferences and sends them to the backend server
    event.preventDefault()
    var data = { 'genres': [], 'other': [] }
    let inputs = document.querySelectorAll("input, select")

    for (const field of inputs) {
        console.log(field, field)

        if (field.name === "genres[]" && field.checked) {
            data['genres'].push(field.value)
            continue
        }

        if (["languages", "length", "country"].includes(field.name)) {
            data[field.name] = field.value
            continue
        }

        if (field.type === "radio" || field.type === "checkbox") {
            if (field.checked) { data[field.name] = field.value }
            continue
        }

        if (field.type === "submit") { continue }

        data['other'].push(field.value)
    }
    document.getElementById('loading-spinner').style.display = 'block'
    fetch(`${API_URL}/preferencesFormHandling`, {
        method: "POST",
        credentials: "include",
        headers: { 
            'Content-Type': 'application/json',
            token: localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    })
        .then(res => {  //After filling out the form
            document.getElementById('loading-spinner').style.display = 'none'
            if (res.ok) {
                window.location.href = 'dashboard.html'
            } else {
                window.location.href = 'index.html'
            }
        })
})