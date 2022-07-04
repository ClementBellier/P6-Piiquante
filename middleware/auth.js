const User = require('../domain/User')

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const response = new User().authorize(token)
    if(response.code >= 400) {
        return res.status(response.code).json(response.message)        
    }
    req.auth = {userId: response.userId}
    next()
}