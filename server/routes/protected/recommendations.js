const axios = require('axios')
const express = require('express')
const User = require('../../models/userSchema')
const router = express.Router()
const oldCutoff = new Date('2005-01-01')

function getSafe(elem, language) {
    try {
        return elem["watch/providers"]['results'][language]['flatrate']
    } catch (e) {
        return undefined;
    }
}

// Endpoint for ignoring preferences, using DELETE http verb
router.delete("/recommendations/:id", async (req, res, next) => {
    // Find user with the corresponding access token
    const userDetails = await User.findOne({ sessionToken: req.cookies.token })

    // Find movie to remove, using its id
    const toRemove = userDetails.recommendations.findIndex((elem) => elem.MovieDBid === Number(req.params.id))
    console.log(toRemove, Number(req.params.id))

    // if no movie is found, return 200 with "already missing" as text
    if(toRemove === -1) { res.status(200).send('Already Missing'); return }

    // Add deleted movie to list of ignored movies of user
    userDetails.ignoredMovies.push(req.params.id)

    //  delete movie from user recommendations
    userDetails.recommendations.splice(toRemove, 1)
    
    // Save and return 200
    await userDetails.save()
    res.sendStatus(200)
    return
})

// Endpoint for adding 'watched' movie, using POST http verb
router.post("/recommendations", async (req, res, next) => {
    // Find user with the corresponding access token
    const userDetails = await User.findOne({ sessionToken: req.cookies.token })

    // Find movie to get new recommendations from, using its id
    const toUpdate = userDetails.recommendations.findIndex((elem) => elem.MovieDBid === Number(req.body.id))
    console.log(toUpdate, req.body, `${process.env.RECOMMENDATIONS_URL}/recommendations`)

    // if no movie is found, return 200 with "already missing" as text
    if (toUpdate === -1) { res.status(200).send('Already Missing'); return }

    // Add watched movie to list of watched movies of user
    userDetails.watchedMovies.push(req.body.id)

    // extract user preferences in a separate variable
    const preferences = userDetails.preferences

    // Get movie recommendations according to the watched movie, using the Python/Flask recommendations Service
    try {
        var response = await axios.get(`${process.env.RECOMMENDATIONS_URL}/recommendations`, {
            params: {
                movieid: req.body.id,
            },
            headers: { "Accept-Encoding": "gzip,deflate,compress" }
        })
    }
    catch (error) {
        // Return 500 if there's an error in the request
        if (error.response) {
            res.status(500).send(error.response)
            return next(new Error(error.response.data))
        } else {
            res.sendStatus(500)
            return next(new Error(error))
        }
    }

    // Filter the recommendations with the user preferences
    response.data.filter(elem => {
        elem.release_date = new Date(elem.release_date)
        return (
            (!preferences.adult ? elem.adult === false : true) && // Remove adult movies, if necessary
            elem.runtime <= preferences.length && // Remove movies going over the max length
            elem.genres.some(genre => preferences.includes(genre.id)) && // Remove movies without any preferred genre
            (preferences.isPopular ? elem.vote_average > 7.00 : true) && // Remove movies that are lowly rated, if necessary
            (preferences.easilyWatchable ? elem["watch/providers"]['results'][preferences.country]['flatrate'].length !== 0 : true) && // Remove movies without any streaming service, if necessary
            (preferences.isOld ? elem.release_date.getTime() < oldCutoff.getTime() : elem.release_date.getTime() >= oldCutoff.getTime()) // Remove older or newer movies, according to user preferences
        )
    })

    for (elem of response.data) {
        console.log(elem.title)
        // If the movie is already present in the recommendations, continue
        if (userDetails.recommendations.find((dbElem) => dbElem.MovieDBid === elem.id)) { continue }

        // If the movie has already been watched, continue
        if (userDetails.watchedMovies.find((alreadyWatchedID) => alreadyWatchedID === elem.id)) { continue }

        // If the movie has already been ignored, continue
        if (userDetails.ignoredMovies.find((alreadyWatchedID) => alreadyWatchedID === elem.id)) { continue }
        
        // Add the new, filtered list of movies to the user recommendations in the database
        elem.genres = elem.genres.map((elem) => elem.name)
        const providers = getSafe(elem, preferences.country.toUpperCase())
        const toAdd = {
            MovieDBid: elem.id,
            title: elem.title,
            overview: elem.overview,
            runtime: elem.runtime,
            genres: elem.genres,
            providers: elem.providers,
            release_date: elem.release_date,
            poster_path: elem.poster_path,
            providers: providers
        }

        userDetails.recommendations.push(toAdd)
    }

    // Remove the watched movie from the recommendations 
    userDetails.recommendations.splice(toUpdate, 1)


    await userDetails.save()
    res.sendStatus(200)
    return
})


module.exports = router