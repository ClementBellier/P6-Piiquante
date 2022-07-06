const Sauce = require('../domain/Sauce')

exports.getAllSauces = async (req, res, next) => {
    const response = await new Sauce().findAll()
    return res.status(response.code).json(response.message)
}
exports.createSauce = async (req, res, next) => {
    const sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    const response = await new Sauce().createSauce(sauceObject)
    return res.status(response.code).json(response.message)
}
exports.getOneSauce = async (req, res, next) => {
    const response = await new Sauce().findOne(req.params.id)
    return res.status(response.code).json(response.message)
}
exports.modifySauce = async (req, res, next) => {
    const userWhoAskModify = req.auth.userId
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        _id: req.params.id,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body,_id: req.params.id}
    const response = await new Sauce().modifySauce(sauceObject, userWhoAskModify)
    return res.status(response.code).json(response.message)
}
exports.deleteSauce = async (req, res, next) => {
    const sauceId = req.params.id
    const userWhoAskDelete = req.auth.userId
    const response = await new Sauce().deleteSauce(sauceId, userWhoAskDelete)
    return res.status(response.code).json(response.message)
}