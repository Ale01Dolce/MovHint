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

router.post("/preferencesFormHandling", async (req, res, next) => {
    var userDetails = await User.findOne({ sessionToken: req.cookies.token })
    // console.log("body ", req.body)
    userDetails.preferences = req.body
    userDetails = await userDetails.save()

    const response = await getPopular(userDetails.preferences)
    // console.log(response)

    if (!response) {
        res.statusCode(500).send()
    } else {

        await User.findOneAndUpdate({ sessionToken: req.cookies.token }, { recommendations: [] })

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

            // console.log(toAdd)
            await User.findOneAndUpdate({ sessionToken: req.cookies.token }, { $push: { recommendations: toAdd } })
        }
        res.sendStatus(200)
    }
})


module.exports = router

async function getPopular(preferences) {

    const oldCutoff = '2005-01-01'
    var filterObject = { "data.genre_ids": { $in: preferences.genres }, "data.runtime": { $lte: preferences.length } }

    if (!preferences.adult) {
        filterObject = { "data.adult": preferences.adult, ...filterObject }
    }

    if (preferences.isOld) {
        filterObject = { "data.release_date": { $lte: oldCutoff }, ...filterObject }
    } else {
        filterObject = { "data.release_date": { $gte: oldCutoff }, ...filterObject }
    }

    if (preferences.isPopular) {
        filterObject = { 'data.vote_average': { $gte: 7.00 }, ...filterObject }
    }

    if(preferences.easilyWatchable) {
        const providerString = `data.watch/providers.results.${preferences.country}.flatrate`
        filterObject = { [providerString]: { $exists: true }, ...filterObject }
    }

    let movieList = await Popular.find(filterObject)
    console.log(filterObject, preferences)
    return movieList.map((elem) => elem.toJSON()).sort(() => Math.random() - 0.5).slice(0, 20)
}
