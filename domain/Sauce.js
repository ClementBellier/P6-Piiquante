const fs = require("fs");

const ApiErrors = require("../domain/ApiErrors");
const Success = require("../domain/Success");

const databaseSauceAccess = require("../persistence/sauce");

class Sauce {
  constructor() {}
  createSauce = async (sauce) => {
    const sauceToSave = {
      ...sauce,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    };
    const savedSauve = await databaseSauceAccess.saveSauceInDB(sauceToSave);
    if (savedSauve.error) return new ApiErrors(savedSauve.error).serverError();
    return new Success().sauceCreated();
  };
  findAll = async () => {
    const sauces = await databaseSauceAccess.findAllSauces();
    if (sauces.error) return new ApiErrors(sauces.error).serverError();
    return new Success().sauceFound(sauces);
  };
  findOne = async (sauceId) => {
    const sauce = await databaseSauceAccess.findOneSauce(sauceId);
    if (!sauce) return new ApiErrors().sauceNotFound();
    if (sauce.error) return new ApiErrors(sauce.error).serverError();
    return new Success().sauceFound(sauce);
  };
  deleteImage = (sauce) => {
    const fileName = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${fileName}`, () => {});
  };
  deleteSauce = async (sauceId, userWhoAskDelete) => {
    const sauce = await databaseSauceAccess.findOneSauce(sauceId);
    if (sauce.error) return new ApiErrors(sauce.error).notFound();
    if (sauce.userId !== userWhoAskDelete)
      return new ApiErrors().unauthorizedRequest();

    this.deleteImage(sauce);
    const deletedSauce = await databaseSauceAccess.deleteSauce(sauceId);
    if (deletedSauce.error) return new ApiErrors(deletedSauce).serverError();
    return new Success().sauceDeleted();
  };
  updateSauce = async (sauce) => {
    return await databaseSauceAccess.modifySauce(sauce);
  };
  modifySauce = async (modifiedSauce, userWhoAskModify) => {
    const originSauce = await databaseSauceAccess.findOneSauce(
      modifiedSauce._id
    );
    if (originSauce.error) return new ApiErrors(originSauce.error).notFound();
    if (originSauce.userId !== userWhoAskModify)
      return new ApiErrors().unauthorizedRequest();

    if (modifiedSauce.imageUrl) this.deleteImage(originSauce);
    const updatedSauce = await this.updateSauce(modifiedSauce);
    if (updatedSauce.error)
      return new ApiErrors(updatedSauce.error).serverError();
    return new Success().sauceModified();
  };
  unlike = async (userId, sauce) => {
    if (sauce.usersLiked.includes(userId)) {
      sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
      sauce.likes--;
    }
    if (sauce.usersDisliked.includes(userId)) {
      sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
      sauce.dislikes--;
    }
    const unlikeSauce = await this.updateSauce(sauce);
    if (unlikeSauce.error)
      return new ApiErrors(unlikeSauce.error).serverError();
    return new Success().unlikeRecord();
  };

  likeSauce = async (userId, like, sauceId) => {
    const sauce = await databaseSauceAccess.findOneSauce(sauceId);
    if (sauce.error) return new ApiErrors(sauce.error).notFound();
    if (like === 0) return await this.unlike(userId, sauce);
    if (
      sauce.usersLiked.includes(userId) ||
      sauce.usersDisliked.includes(userId)
    )
      return new ApiErrors("L'utilisateur-rice a déjà voté").badRequest();
    if (like === 1) {
      sauce.likes++;
      sauce.usersLiked.push(`${userId}`);
    }
    if (like === -1) {
      sauce.dislikes++;
      sauce.usersDisliked.push(`${userId}`);
    }
    const likeSauce = await this.updateSauce(sauce);
    if (likeSauce.error) return new ApiErrors(likeSauce.error).serverError();
    return new Success().likeRecord();
  };
}

module.exports = Sauce;
