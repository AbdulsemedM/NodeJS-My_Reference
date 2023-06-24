import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const {password, ...others} = updatedUser._doc
      res.status(200).json(others);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      await Video.deleteMany({userId: req.params.id})
      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, ...other} = user._doc
    res.status(200).json(other) } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  
  try {
    const user = await User.find({}).select('-password -_id -__v')
    // console.log(user);
    // const {password, ...other} = user._doc
    res.status(200).json(user) } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  const user = await User.findById(req.params.id)

  const currentUser = await User.findById(req.body.id)

  if (user.subscribedUsers.includes(currentUser)){
  try {

      await User.findByIdAndUpdate(req.user.id, {
        
        $push: { subscription: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: 1 },
      });
      await User.findByIdAndUpdate(req.params.id,{
        $push:{ subscribedUsers: req.user.id },
      })
      res.status(200).json("Subscription successfull.")
    } catch (err) {
      next(err);
    }
  }else{
    return next(createError(403, "you have already subcribed"))
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscription: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      await User.findByIdAndUpdate(req.params.id,{
        $pull: { subscribedUsers: req.params.id}
      })
      res.status(200).json("Unsubscription successfull.")
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId,{
      $addToSet:{likes:id},
      $pull:{dislikes:id}
    })
    res.status(200).json("The video has been liked.")
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
      await Video.findByIdAndUpdate(videoId,{
        $addToSet:{dislikes:id},
        $pull:{likes:id}
      })
      res.status(200).json("The video has been disliked.")
  } catch (err) {
    next(err);
  }
};
