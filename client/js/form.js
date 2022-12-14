/** @type {HTMLFormElement} */
let form = document.getElementById("form-preferences")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    var data = []
    let inputs = document.querySelectorAll("input, select")
    for(field of inputs) {
        console.log(field.value, field.type)
        if (field.type== "radio" || field.type == "checkbox") {
            if (field.checked) { data.push(field.value) }
            continue
        }

        if (field.type == "submit") { continue }
        
        data.push(field.value)
    }
    console.log(data)
})