const express = require("express")
const Popular = require("../models/popularSchema")
const axios = require("axios")
const router = express.Router()
const popularEndpoint = `https://api.themoviedb.org/3/movie/top_rated`
const detailsEndpoint = id => `https://api.themoviedb.org/3/movie/${id}`


router.get("/getPopular", async (req, res, next) => {

    let currentPage = 6
    let finalPage = currentPage + 5
    while (currentPage < finalPage) {

        try {
            var response = await axios.get(popularEndpoint, {
                params: {
                    api_key: process.env.MVDB_KEY,
                    page: currentPage
                }
            })
       }
        catch (error) {
            if (error.response) {
                throw new Error(error.response.data)
            } else {
                throw new Error(error)
            }
        }

        //console.log(response)

        for (elem of response.data.results) {
            
            let details = await axios.get(detailsEndpoint(elem.id), {
                params: {
                    api_key: process.env.MVDB_KEY
                }
            })

            console.log({...elem, ...details.data})
            await new Popular({data: {...elem, ...details.data}}).save()
            // throw Error('Stop')
        }
        currentPage++
    }

    res.send("Done")
})

module.exports = router


// while(movieList.length < 20 && currentPage < 3) {

//     try {
//         var response = await axios.get(popularEndpoint, {
//             params: {
//                 api_key: process.env.MVDB_KEY,
//                 language: filters.language,
//                 page: currentPage
//             }
//         })
//     }
//     catch(error) {
//         if(error.response) {
//             console.log(error.response.data)
//             return []
//         }
//     }

//     console.log(response)
//     if(!response) { return [] }

//     for(elem of response.data.results) {
//         filters.adult = (filters.adult == "true" ? true : false)
//         console.log(filters)
        
//         if(!filters.adult) {
//             if(elem.adult) { continue }
//         }
//         console.log("First filter")
        
//         let found = false
//         filters.genres = filters.genres.map(Number)
//         console.log(elem.genre_ids)

//         for (id of elem.genre_ids) {
//             if(filters.genres.includes(id)) { 
//                 found = true
//                 break
//             }
//         }

//         if(!found) { continue }

//         console.log("Second filter")
//         let details = await axios.get(detailsEndpoint(elem.id), {
//             params: {
//                 api_key: process.env.MVDB_KEY
//             }
//         })
        
//         //console.log(details)
//         if(details.runtime > filters.length) { continue }
//         console.log("Third filter")
//         movieList.push(elem)
//     }

//     currentPage++
// }




