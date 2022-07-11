const sauceModel = require('../models/Sauce')

exports.saveSauceInDB = async (sauce) => {
    const newSauce = new sauceModel({...sauce})
    return newSauce.save()
        .then(sauce => sauce)
        .catch(error => {return {error}})
}

exports.findAllSauces = async () => {
    return sauceModel.find()
        .then(sauces => sauces)
        .catch(error => {return {error}})
}

exports.findOneSauce = async (sauceId) => {
    return sauceModel.findOne({_id: sauceId})
        .then(sauce => sauce)
        .catch(error => {return {error}})
}

exports.deleteSauce = async (sauceId) => {
    return sauceModel.deleteOne({_id: sauceId})
     .then(deleteResult =>{
        if(deleteResult.ok === 0) return ({error: "Sauce inexistante"})
        return deleteResult
     })
     .catch(error => {return {error}})
}

exports.modifySauce = async (sauce) => {
    return sauceModel.findOneAndUpdate({_id: sauce._id},{...sauce},{new: true})
     .then(sauce => sauce)
     .catch(error => {return {error}})
}