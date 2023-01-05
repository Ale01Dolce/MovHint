/*change navbar style on scroll*/

window.addEventListener('scroll',()=>{
    document.querySelector('nav').classList.toggle
    ('window-scroll',window.scrollY>0)
})

fetch("http://localhost:3000/api/userDetails", {
    method: "GET",
    credentials: "include"
}).then(response => {
    console.log(response.status)
    if (response.status === 403) {
        document.getElementById("login-navbar").innerHTML = "login"
        document.getElementById("login-navbar").setAttribute('href', 'login.html')
    } else {
        document.getElementById("login-navbar").innerHTML = "logout"
        document.getElementById("login-navbar").setAttribute('href', 'logout.html')
    }
})