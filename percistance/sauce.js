const sauceModel = require('../models/Sauce')

exports.saveSauceInDB = async (sauce) => {
    const newSauce = new sauceModel({...sauce})
    const isAnErrorMessage = false
    return newSauce.save()
        .then(() => isAnErrorMessage)
        .catch(error => error)
}

exports.findAllSauces = async () => {
    return sauceModel.find()
        .then(sauces => sauces)
        .catch(error => error)
}

exports.findOneSauce = async (sauceId) => {
    return sauceModel.findOne({_id: sauceId})
        .then(sauce => sauce)
        .catch(error => error)
}

exports.deleteSauce = async (sauceId) => {
    const isAnErrorMessage = false
    return sauceModel.deleteOne({_id: sauceId})
     .then(()=> isAnErrorMessage)
     .catch(error => error)
}