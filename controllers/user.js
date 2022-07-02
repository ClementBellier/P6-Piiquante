const User = require('../domain/User')

exports.signup = async (req, res, next) => {
    const user = new User(req.body.email, req.body.password)
    const response = await user.saveUser()
    return res.status(response.code).json(response.message)
}

exports.login = async (req, res, next) => {
    const user = new User(req.body.email, req.body.password)
    const response = await user.findUser()
    return res.status(response.code).json(response.message)
}