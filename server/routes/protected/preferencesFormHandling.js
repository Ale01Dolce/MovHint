const express = require('express')
const User = require('../../models/userSchema')
const router = express.Router()
const axios = require("axios")

movie_genres = JSON.parse(`{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]}`)

movie_genres_ids = {}

for(i of movie_genres["genres"]) {
    movie_genres_ids[i['id']] = i['name']
}

const popularEndpoint = `https://api.themoviedb.org/3/movie/popular`
const detailsEndpoint = id => `https://api.themoviedb.org/3/movie/${id}`

router.post("/preferencesFormHandling", async (req, res, next) => {
    const userDetails = await User.findOne({sessionToken: req.cookies.token})
    console.log("body ", req.body)
    userDetails.preferences = req.body
    await userDetails.save()

    const response = await getPopular(req.body)
    console.log(response)
    res.send(JSON.stringify(response))
    
    //res.redirect("http://localhost:5000/client/")
})


module.exports = router

async function getPopular(filters) {
    let movieList = []

    let currentPage = 1
    while(movieList.length < 20 && currentPage < 6) {

        try {
            var response = await axios.get(popularEndpoint, {
                params: {
                    api_key: process.env.MVDB_KEY,
                    language: filters.language,
                    page: currentPage
                }
            })
        }
        catch(error) {
            if(error.response) {
                console.log(error.response.data)
            }
        }

        // console.log(response.data.results)

        for(elem of response.data.results) {
            filters.adult = (filters.adult == "true" ? true : false)

            console.log(filters)
            if(elem.adult !== filters.adult) { continue }
            
            const found = elem.genre_ids.some(r => filters.genres.includes(r))
            if(!found) { continue }

            let details = await axios.get(detailsEndpoint(elem.id), {
                params: {
                    api_key: process.env.MVDB_KEY
                }
            })

            if(details.runtime > filters.length) { continue }

            movieList.push(elem)
        }

        currentPage++
    }

    return movieList
}
