const Popular = require("./models/popularSchema")
const axios = require("axios")
const mongoose = require('mongoose')
require("dotenv").config();

async function initializeDB() {
    const popularEndpoint = `https://api.themoviedb.org/3/movie/top_rated`
    const detailsEndpoint = id => `https://api.themoviedb.org/3/movie/${id}`
    const appendToResponseString = 'append_to_response=watch%2Fproviders%2Ccredits%2Calternative_titles%2Cimages%2Ckeywords'
    let currentPage = 1
    let finalPage = currentPage + 20

    mongoose.connect(process.env.MONGODB_LOGIN);
    // await Popular.deleteMany()
    while (currentPage < finalPage) {

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

        //console.log(response)

        for (elem of response.data.results) {
            if(await Popular.findOne({'data.id': elem.id})) { continue }
            let details = await axios.get(detailsEndpoint(elem.id) + `?${appendToResponseString}`, {
                params: {
                    api_key: process.env.MVDB_KEY, 
                },
                headers: { "Accept-Encoding": "gzip,deflate,compress" }
            })

            console.log(details.request.path)
            await new Popular({ data: { ...elem, ...details.data } }).save()
            // throw Error('Stop')
        }
        currentPage++
    }
}

initializeDB().then(() => {
    console.log("Done!")
    mongoose.disconnect()
    process.exit()
})