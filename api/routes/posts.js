const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post

//post the post in the home page
router.post("/", async (req, res) => {
  //request post from the body of the Post as we have the post in the "Post" file
  const newPost = new Post(req.body);
  try {
    //save the post
    const savedPost = await newPost.save();
    // show the saved post
    res.status(200).json(savedPost);
  } catch (err) {
    //if error occours
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    //finding the post by the userId written by the user
    //finding by the id written by the user
    const post = await Post.findById(req.params.id);
    //Checking if id written by the user is same as the id in the body
    if (post.userId === req.body.userId) {
      //If it is same then updating the post
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      //else send error
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    //if error occours in above process
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    //Finding the id written by the user
    //req.params.id find the id of the user using the file
    //and req.bdy.id find the id in the data
    const post = await Post.findById(req.params.id);
    //Checking if id written by the user is same as the id in the body
    if (post.userId === req.body.userId) {
      //If it is same then deleting the post
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      //else send error
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    //if error occours in above process
    res.status(500).json(err);
  }
});

//like / dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    //finding the post by the userId written by the user
    //finding the userId by the id written by user
    const post = await Post.findById(req.params.id);
    //If the post does not include the like by the userId 
    if (!post.likes.includes(req.body.userId)) {
      //Then pushing the userId of the user in the post and thus post is liked by that userId
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      //Else pulling out userId of the user in the post and thus post is disliked by that userId
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    //If error occours in above process
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    //finding the post by the userId written by the user
    const post = await Post.findById(req.params.id);
    //If it finds send the post
    res.status(200).json(post);
  } catch (err) {
    //else show error
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    //Finding the current user
    const currentUser = await User.findById(req.params.userId);
    //Finding the posts of the current user
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      // Mapping the following of the currentr user and finding the posts of the followings by the id 
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    //Now merging the user posts with the friends post and showing all the posts in the timeline
    //concat merges the two arrays into one array
    // (...friendPosts) means all the friendPosts in the array
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    //If error occours
    res.status(500).json(err);
  }
});

//get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    //Finding the username of the user
    const user = await User.findOne({ username: req.params.username });
    //Finding the posts of the user by userId
    const posts = await Post.find({ userId: user._id });
    //send the posts
    res.status(200).json(posts);
  } catch (err) {
    //if error occours show error
    res.status(500).json(err);
  }
});

module.exports = router;
