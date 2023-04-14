const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        // get the authorization token from the header
        const token = await req.headers.authorization.split(' ')[1]

        //check if the one at the header is same as the original token
        await jwt.verify(token, 'random_key')//.then((res)).catch((err)=>console.log(err))
        //user details is retrieved from the verify

        const user = await decode
        req.user = user


        // pass down functionality to the endpoint
        next();


    } catch (error) {
        res.status(401).json({
            error: new Error('Invalid request')
        })
    }
}