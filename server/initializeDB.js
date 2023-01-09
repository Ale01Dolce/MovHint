const Popular = require("./models/popularSchema")
const axios = require("axios")
const mongoose = require('mongoose')
require("dotenv").config();

// Standalone file for databse first initialization, can be run with `npm run first`
async function initializeDB() {
    const popularEndpoint = `https://api.themoviedb.org/3/movie/top_rated`
    const detailsEndpoint = id => `https://api.themoviedb.org/3/movie/${id}`
    const appendToResponseString = 'append_to_response=watch%2Fproviders%2Ccredits%2Calternative_titles%2Cimages%2Ckeywords'
    let currentPage = 1
    let count = 0
    let finalPage = currentPage + 20

    // Connect to database
    mongoose.connect(process.env.MONGODB_LOGIN);

    // Loop for a number of pages, defined above
    while (currentPage < finalPage) {

        // Get most popular movies
        try {
            var response = await axios.get(popularEndpoint, {
                params: {
                    api_key: process.env.MVDB_KEY,
                    page: currentPage
                },
                headers: { "Accept-Encoding": "gzip,deflate,compress" }
            })
        }
        catch (error) {
            if (error.response) {
                console.log(error.response)
                throw new Error(error.response.data)
            } else {
                throw new Error(error)
            }
        }

        // For each popular movie...
        for (elem of response.data.results) {

            count++
            console.log(`Elem N. ${count}`)
            // ...if it's already present, continue...
            if(await Popular.findOne({'data.id': elem.id})) { continue }
            
            // ...otherwise, get all the details...
            let details = await axios.get(detailsEndpoint(elem.id) + `?${appendToResponseString}`, {
                params: {
                    api_key: process.env.MVDB_KEY, 
                },
                headers: { "Accept-Encoding": "gzip,deflate,compress" }
            })

            console.log(details.request.path)
            // ...and save them to the database
            await new Popular({ data: { ...elem, ...details.data } }).save()
        }
        currentPage++
    }
}

// Run async function, then disconnect from DB once completed
initializeDB().then(() => {
    console.log("Done!")
    mongoose.disconnect()
    process.exit()
})