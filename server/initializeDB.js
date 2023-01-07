const Popular = require("./models/popularSchema")
const axios = require("axios")
require("dotenv").config();

const popularEndpoint = `https://api.themoviedb.org/3/movie/top_rated`
const detailsEndpoint = id => `https://api.themoviedb.org/3/movie/${id}`

let currentPage = 1
let finalPage = currentPage + 5
async function initializeDB() {
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
                console.log(error.response)
                throw new Error(error.response.data)
            } else {
                throw new Error(error)
            }
        }

        //console.log(response)

        for (elem of response.data.results) {

            let details = await axios.get(detailsEndpoint(elem.id), {
                params: {
                    api_key: process.env.MVDB_KEY,
                    append_to_response: "watch/providers%2Ccredits%2Calternative_titles%2Cimages%2Ckeywords"
                }
            })

            console.log({ ...elem, ...details.data })
            await new Popular({ data: { ...elem, ...details.data } }).save()
            // throw Error('Stop')
        }
        currentPage++
    }
}

initializeDB()