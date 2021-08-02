import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {//Passing props inside Feed
  const [posts, setPosts] = useState([]);//Using it as a array
  const { user } = useContext(AuthContext);//Importing the user from the AuthContext

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
      // Get username else get userid
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("posts/timeline/" + user._id);
      setPosts(
        //Sorting two posts according to the day it is posted and newer one wil be shown up
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);//page will be refreshed every time when username and userid is changed

  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* username not equal to or username equal to user.username   */}
        {(!username || username === user.username) && <Share />}
        {/* map posts of useState with Post */}
        {/* Now we can use all values inside the posts */}
        {posts.map((p) => (
          // Passing props inside Post
          // Now if user passes the prop post then it can fetch all the values inside the p
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
