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
        const savedSauve = await sauceInDB.saveSauceInDB(sauceToSave)
        if(savedSauve.error) return new Errors(savedSauve.error).badRequest()
        return new Success().sauceCreated()
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
    deleteImage = sauce => {
        const fileName = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${fileName}`, ()=>{})
    }
    deleteSauce = async (sauceId, userWhoAskDelete) => {
        const sauce = await sauceInDB.findOneSauce(sauceId)
        if(sauce.error) return new Errors(sauce.error).serverError()
        if(sauce.userId !== userWhoAskDelete) return new Errors().unauthorizedRequest()

        this.deleteImage(sauce)
        const isAnErrorMessage = await sauceInDB.deleteSauce(sauceId)
        if(!isAnErrorMessage) return new Success().sauceDeleted()
        return new Errors(isAnErrorMessage).serverError()
    }
    updateSauce = async (sauce) => {
        return await sauceInDB.modifySauce(sauce)
    }
    modifySauce = async (modifiedSauce, userWhoAskModify) => {
        const originSauce = await sauceInDB.findOneSauce(modifiedSauce._id)
        if(originSauce.error) return new Errors(originSauce.error).serverError()
        if(originSauce.userId !== userWhoAskModify) return new Errors().unauthorizedRequest()
        
        if(modifiedSauce.imageUrl) this.deleteImage(originSauce)
        const updatedSauce = await this.updateSauce(modifiedSauce)
        if(updatedSauce.error) return new Errors(updatedSauce.error).serverError()
        return new Success().sauceModified()
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
        const unlikeSauce = await this.updateSauce(sauce)
        if(unlikeSauce.error) return new Errors(unlikeSauce.error).serverError()
        return new Success().unlikeRecord()
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
        const likeSauce = await this.updateSauce(sauce)
        if(likeSauce.error) return new Errors(likeSauce.error).serverError()
        return new Success().likeRecord()
    }
}

module.exports = Sauce