//external imports

const mongoose = require('mongoose')
require('dotenv').config()

async function dbConnect() {
    mongoose.connect(
        process.env.DB_URL, {

        // // to ensure connections are made properly 

        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true

        /** Deprecaretd */
    }
    ).then(() => console.log('connection established successfully'))
        .catch((err) => {
            console.log('unable to connect to mongodb atlas server')
            console.error(err)
        }
        )
}

module.exports = dbConnect