const User = require('../domain/User')
const crypt = require('../encryption/crypt')

exports.signup = async (req, res, next) => {
    const user = new User(req.body.email, req.body.password)
    const IsAnError = await user.saveUser()
    if(!IsAnError) return res.status(201).json({message: 'Utilisateur créé !'})
    return res.status(400).json({error: IsAnError})
}

exports.login = async (req, res, next) => {
    const user = new User(req.body.email, req.body.password)
    const foundUser = await user.findUser()
    const userNotFound = 0
    const wrongPassword = -1
    if(foundUser === userNotFound) return res.status(401).json({error: 'Utilisateur non trouvé !'})
    if(foundUser === wrongPassword) return res.status(401).json({error: 'Mot de pass incorrect !'})
    res.status(200).json({foundUser})
}