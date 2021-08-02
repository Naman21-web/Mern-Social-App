import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {//Using props
  const [like, setLike] = useState(post.likes.length);//set initial like to length of post.likes
  const [isLiked, setIsLiked] = useState(false);//set initial like to false
  const [user, setUser] = useState({});//Passing user as a object
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;//Using this folder
  const { user: currentUser } = useContext(AuthContext);//Importing currentUser from user in the AuthContext

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));//if user liked post include userid of user in tgelikes
  }, [currentUser._id, post.likes]);//Refresh every time when currentUser._id and post.likes are changed

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);//Fetch this
      setUser(res.data);//Assign user res.data(i.e., data whixh we get by fetching above link) value
    };
    fetchUser();
  }, [post.userId]);//Refresh every time post.userId is changed

  const likeHandler = () => {
    try {
      //Put currentUser._id in the id of the above user (i.e., post._id)
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    //If isLiked is true then decrease like by 1 else increase like by 1
    setLike(isLiked ? like - 1 : like + 1);
    //setIsLiked opposite of isLiked (i.e., true if false and false if true)
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  //If user has profile picture the set profile picture to PF + user.profilePicture else set profile
                  // picture to PF + "person/noAvatar.png"
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            {/* Show when post is created */}
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          {/* Setting post.desc and post.img*/}
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              // onclick use function likeHandler
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              // use heart.png in PF
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            {/* liked by these no of people */}
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            {/* shows post.comment */}
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
