const sauceModel = require('../models/Sauce')

exports.saveSauceInDB = async (sauce) => {
    const newSauce = new sauceModel({...sauce})
    const FalseOrErrorMessage = false
    return newSauce.save()
        .then(() => FalseOrErrorMessage)
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
    const FalseOrErrorMessage = false
    return sauceModel.deleteOne({_id: sauceId})
     .then(()=> FalseOrErrorMessage)
     .catch(error => error)
}