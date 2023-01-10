const express = require('express')
const User = require('../../models/userSchema')
const router = express.Router()
const Popular = require('../../models/popularSchema')


function getSafe(elem, language) {
    try {
        // console.log(elem["watch/providers"]['results'][language]['flatrate'], language)
        return elem["watch/providers"]['results'][language]['flatrate']
    } catch (e) {
        return undefined;
    }
}

// Endpoint for handling the questionary, using POST http verb
router.post("/preferencesFormHandling", async (req, res, next) => {
    // Get the user with the corresponding access token
    var userDetails = await User.findOne({ sessionToken: req.headers.token })

    // Save preferences to database
    userDetails.preferences = req.body
    userDetails = await userDetails.save()

    // Get the most popular movies in accordance with the user preferences
    const response = await getPopular(userDetails.preferences)

    // If no movies are found, send error code to client
    if (!response) {
        res.statusCode(500).send()
        return
    }

    //Else, get current user...
    await User.findOneAndUpdate({ sessionToken: req.headers.token }, { recommendations: [] })

    //...and add the recommendations to the database 
    for (elem of response) {
        elem = elem.data
        elem.genres = elem.genres.map((elem) => elem.name)
        const providers = getSafe(elem, req.body.country.toUpperCase())
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

        await User.findOneAndUpdate({ sessionToken: req.headers.token }, { $push: { recommendations: toAdd } })
    }
    res.sendStatus(200)
    return
})


module.exports = router

async function getPopular(preferences) {

    const oldCutoff = '2005-01-01'
    //Initial filter, with genres, and maximum length
    var filterObject = { "data.genre_ids": { $in: preferences.genres }, "data.runtime": { $lte: preferences.length } }

    // filter adult film if necessary
    if (!preferences.adult) {
        filterObject = { "data.adult": preferences.adult, ...filterObject }
    }

    // Filter older or newer movies, according to user preferences
    if (preferences.isOld) {
        filterObject = { "data.release_date": { $lte: oldCutoff }, ...filterObject }
    } else {
        filterObject = { "data.release_date": { $gte: oldCutoff }, ...filterObject }
    }

    // Filter low rated movies, if necessary
    if (preferences.isPopular) {
        filterObject = { 'data.vote_average': { $gte: 7.00 }, ...filterObject }
    }

    // Filter movies without any streaming service, if necessary
    if(preferences.easilyWatchable) {
        const providerString = `data.watch/providers.results.${preferences.country}.flatrate`
        filterObject = { [providerString]: { $exists: true }, ...filterObject }
    }

    // Find movies according to filters
    let movieList = await Popular.find(filterObject)
    console.log(filterObject, preferences)

    // Return 20 randomized filtered movies
    return movieList.map((elem) => elem.toJSON()).sort(() => Math.random() - 0.5).slice(0, 20)
}
