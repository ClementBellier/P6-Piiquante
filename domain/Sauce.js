const fs = require('fs')

const Errors = require('../domain/Error')
const Success = require('../domain/Success')

const sauceInDB = require('../percistance/sauce')

class Sauce {
    constructor(){}
    createSauce = async (sauce, imageUrl) => {
        const sauceToSave = {
            ...sauce,
            likes: 0,
            dislikes: 0,
            userLiked: [],
            userDisliked: [],
            imageUrl: imageUrl
        }
        const FalseOrErrorMessage = await sauceInDB.saveSauceInDB(sauceToSave)
        if(!FalseOrErrorMessage) return new Success().sauceCreated()
        return new Errors(FalseOrErrorMessage).badRequest()
    }
    findAll = async () => {
        const sauces = await sauceInDB.findAllSauces()
        if(sauces.error) return new Errors(sauces.error).serverError()
        return new Success().sauceFound(sauces)
    }
    findOne = async (sauceId) => {
        const sauce = await sauceInDB.findOneSauce(sauceId)
        if(sauce.error) return new Errors(sauce.error).serverError()
        return new Success().sauceFound(sauce)
    }
    deleteSauce = async (sauceId, userWhoAskDelete) => {
        const sauce = await sauceInDB.findOneSauce(sauceId)
        if(sauce.error) return new Errors(sauce.error).serverError()
        if(sauce.userId !== userWhoAskDelete) return new Errors().unauthorizedRequest()

        const fileName = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${fileName}`, ()=>{})
        const FalseOrErrorMessage = await sauceInDB.deleteSauce(sauceId)
        if(!FalseOrErrorMessage) return new Success().sauceDeleted()
        return new Errors(FalseOrErrorMessage).serverError()
    }
}

module.exports = Sauce