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

    if(!response) {
        res.statusCode(500).send()
    } else {
        res.send(JSON.stringify(response))
    }
    
    //res.redirect("http://localhost:5000/client/")
})


module.exports = router

async function getPopular(filters) {
    let movieList = []

    let currentPage = 1
    while(movieList.length < 20 && currentPage < 3) {

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
                return []
            }
        }

        console.log(response)
        if(!response) { return [] }

        for(elem of response.data.results) {
            filters.adult = (filters.adult == "true" ? true : false)
            console.log(filters)
            
            if(!filters.adult) {
                if(elem.adult) { continue }
            }
            console.log("First filter")
            
            let found = false
            filters.genres = filters.genres.map(Number)
            console.log(elem.genre_ids)

            for (id of elem.genre_ids) {
                if(filters.genres.includes(id)) { 
                    found = true
                    break
                }
            }

            if(!found) { continue }

            console.log("Second filter")
            let details = await axios.get(detailsEndpoint(elem.id), {
                params: {
                    api_key: process.env.MVDB_KEY
                }
            })
            
            //console.log(details)
            if(details.runtime > filters.length) { continue }
            console.log("Third filter")
            movieList.push(elem)
        }

        currentPage++
    }

    return movieList
}
