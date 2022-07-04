const Sauce = require('../domain/Sauce')

exports.getAllSauces = async (req, res, next) => {
    const response = await new Sauce().findAll()
    return res.status(response.code).json(response.message)
}
exports.createSauce = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    const response = await new Sauce().createSauce(sauceObject, imageUrl)
    return res.status(response.code).json(response.message)
}
exports.getOneSauce = async (req, res, next) => {
    const response = await new Sauce().findOne(req.params.id)
    return res.status(response.code).json(response.message)
}
exports.modifySauce = (req, res, next) => {
    console.log(req.body)
}
exports.deleteSauce = async (req, res, next) => {
    const sauceId = req.params.id
    const userWhoAskDelete = req.auth.userId
    const response = await new Sauce().deleteSauce(sauceId, userWhoAskDelete)
    return res.status(response.code).json(response.message)
}