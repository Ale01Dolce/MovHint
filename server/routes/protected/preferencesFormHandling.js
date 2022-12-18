const express = require('express')
const User = require('../../models/userSchema')
const router = express.Router()
const axios = require("axios")
const Popular = require('../../models/popularSchema')

movie_genres = JSON.parse(`{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]}`)

movie_genres_ids = {}

for(i of movie_genres["genres"]) {
    movie_genres_ids[i['id']] = i['name']
}

const popularEndpoint = `https://api.themoviedb.org/3/movie/popular`
const detailsEndpoint = id => `https://api.themoviedb.org/3/movie/${id}`

router.post("/preferencesFormHandling", async (req, res, next) => {
    const userDetails = await User.findOne({sessionToken: req.cookies.token})
    // console.log("body ", req.body)
    userDetails.preferences = req.body
    await userDetails.save()

    const response = await getPopular(req.body)
    // console.log(response)

    if(!response) {
        res.statusCode(500).send()
    } else {
        res.send(JSON.stringify(response))
    }
    
    //res.redirect("http://localhost:5000/client/")
})


module.exports = router

async function getPopular(filters) {

    filters.genres = filters.genres.map(Number)
    filters.length = Number(filters.length)
    filters.adult = Boolean(filters.adult)

    if(filters.adult) {
        var filterObject = {"data.genre_ids": { $in: filters.genres }, "data.runtime": {$lte: filters.length}}
    } else {
        var filterObject = {"data.adult": filters.adult, "data.genre_ids": { $in: filters.genres }, "data.runtime": {$lte: filters.length}}
    }

    let movieList = await Popular.find(filterObject)
    console.log(movieList)
    return movieList.map((elem) => elem.toJSON()).sort(() => Math.random() - 0.5).slice(0, 20)
}
