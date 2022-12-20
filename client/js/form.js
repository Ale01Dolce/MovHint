/** @type {HTMLFormElement} */
let form = document.getElementById("form-preferences")
let movie_card_template = ""

fetch("html/movie_card.ejs")
        .then(r => r.text())
        .then(text => movie_card_template = text)


form.addEventListener("submit", (e) => {
    e.preventDefault()
    var data = {'genres': [], 'other': []}
    let inputs = document.querySelectorAll("input, select")
    
    for(field of inputs) {
        console.log(field.value, field.type)

        if(field.name === "genres[]" && field.checked) {
            data['genres'].push(field.value)
            continue
        }

        if(field.name === "languages") {
            data[field.name] = field.value
            continue
        }

        if(field.name === "length") {
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
    
    fetch("http://localhost:3000/api/preferencesFormHandling", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
        /** @type {HTMLFormElement} */
        let suggestionsForm = document.getElementById("second-part-form")
        suggestionsForm.innerHTML = ''

        console.log(json)
        for (elem of json) {
            const html = ejs.render(movie_card_template, {movie: elem.data})
            suggestionsForm.innerHTML += html
        }
    })


})