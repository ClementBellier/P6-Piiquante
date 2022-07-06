const fs = require('fs')

const Errors = require('../domain/Error')
const Success = require('../domain/Success')

const sauceInDB = require('../percistance/sauce')

class Sauce {
    constructor(){}
    createSauce = async (sauce) => {
        const sauceToSave = {
            ...sauce,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        }
        const isAnErrorMessage = await sauceInDB.saveSauceInDB(sauceToSave)
        if(!isAnErrorMessage) return new Success().sauceCreated()
        return new Errors(isAnErrorMessage).badRequest()
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
        const isAnErrorMessage = await sauceInDB.deleteSauce(sauceId)
        if(!isAnErrorMessage) return new Success().sauceDeleted()
        return new Errors(isAnErrorMessage).serverError()
    }
    updateSauce = async (sauce) => {
        const isAnErrorMessage = await sauceInDB.modifySauce(sauce)
        if(!isAnErrorMessage) return new Success().sauceModified()
        return new Errors(isAnErrorMessage).serverError()
    }
    modifySauce = async (sauceObject, userWhoAskModify) => {
        const sauce = await sauceInDB.findOneSauce(sauceObject._id)
        if(sauce.error) return new Errors(sauce.error).serverError()
        if(sauce.userId !== userWhoAskModify) return new Errors().unauthorizedRequest()
        
        return await this.updateSauce(sauceObject)
    }
    unlike = async (userId, sauce) => {
        if(sauce.usersLiked.includes(userId)){
            sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId)
            sauce.likes--
        }
        if(sauce.usersDisliked.includes(userId)){
            sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId)
            sauce.dislikes--
        }
        return await this.updateSauce(sauce)
    }

    likeSauce = async (userId, like, sauceId) => {
        const sauce = await sauceInDB.findOneSauce(sauceId)
        if(sauce.error) return new Errors(sauce.error).serverError()
        if(like === 0) return await this.unlike(userId, sauce)
        if(sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)) return new Errors("L'utilisateur a déjà voté").badRequest()
        if(like === 1) {
            sauce.likes ++
            sauce.usersLiked.push(`${userId}`)
        }
        if(like === -1) {
            sauce.dislikes ++
            sauce.usersDisliked.push(`${userId}`)
        }
        return await this.updateSauce(sauce)
    }
}

module.exports = Sauce