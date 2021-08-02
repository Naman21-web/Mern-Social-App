const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  // if userId is equal to the id in the body or user isAdmin
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // if password
    if (req.body.password) {
      try {
        gen
        const salt = await bcrypt.genSalt(10);
        //bcrypt password
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        //If it catches error
        return res.status(500).json(err);
      }
    }
    try {
      //finding by the id
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      //if succesful
      res.status(200).json("Account has been updated");
    } catch (err) {
      //If catches error
      return res.status(500).json(err);
    }
  } else {
    //If other error occours
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  // if userId is equal to the id in the body or user isAdmin
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      //finding by the id and deleting that id
      await User.findByIdAndDelete(req.params.id);
      //sending the account has been deleted
      res.status(200).json("Account has been deleted");
    } catch (err) {
      //if error occours
      return res.status(500).json(err);
    }
  } else {
    //else show this
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/", async (req, res) => {
  //getting userId and username 
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
    //find by userId or username
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    // show all other details except password and updatedAt
    res.status(200).json(other);
  } catch (err) {
    //If it catches error
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    //find by id
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      // mapping followings and getting friends
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    //declaring friendList as an array
    let friendList = [];
    // mapping with the friends
    friends.map((friend) => {
      // getting _id, username, profilePicture of the friend
      const { _id, username, profilePicture } = friend;
      // pushing _id, username, profilePicture into friendList
      friendList.push({ _id, username, profilePicture });
    });
    //send sfriendList
    res.status(200).json(friendList)
  } catch (err) {
    //If error occours
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  //If req.userId is not equal to req.params
  if (req.body.userId !== req.params.id) {
    try {
      //find by id of the user
      const user = await User.findById(req.params.id);
      //find by id in the body
      const currentUser = await User.findById(req.body.userId);
      // if followers does not include userId
      if (!user.followers.includes(req.body.userId)) {
        //Push userId in the followers of the user
        await user.updateOne({ $push: { followers: req.body.userId } });
        //Push userId in the followings of the Currentuser
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        //sending this
        res.status(200).json("user has been followed");
      } else {
        //else show
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      //If it catches error
      res.status(500).json(err);
    }
  } else {
    //show this
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  //If req.userId is not equal to req.params
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        //pull that userId from the followers of user
        await user.updateOne({ $pull: { followers: req.body.userId } });
        //pull that userId from the followerings of Currentuser
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

module.exports = router;
