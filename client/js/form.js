/** @type {HTMLFormElement} */
import { API_URL } from "./config.js"

document.getElementById('form-preferences').addEventListener("submit", (event) => {

    event.preventDefault()
    var data = { 'genres': [], 'other': [] }
    let inputs = document.querySelectorAll("input, select")

    for (const field of inputs) {
        console.log(field, field)

        if (field.name === "genres[]" && field.checked) {
            data['genres'].push(field.value)
            continue
        }

        if (field.name === "languages") {
            data[field.name] = field.value
            continue
        }

        if (field.name === "length") {
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

    fetch(`${API_URL}/preferencesFormHandling`, {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                window.location.href = 'dashboard.html'
            } else {
                window.location.href = 'index.html'
            }
        })
})