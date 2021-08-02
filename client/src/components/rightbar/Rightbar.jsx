import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";

export default function Rightbar({ user }) {//Passing the props user
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;//Using this folder
  const [friends, setFriends] = useState([]);//Passing the friens as a array
  const { user: currentUser, dispatch } = useContext(AuthContext);//Using currentuser in the user and dispatch
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?.id)//If userid is included in the following of the currentUser
    //user of the props and currentUser of the user are different dont consider them same
  );

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);//Fetch this 
        setFriends(friendList.data);//setFriends to data of the above fetched link
      } catch (err) {
        console.log(err);//If it catches error
      }
    };
    //We have created the function beacuse we cant use async in useEffect directly
    getFriends();//Calling the function getFriends
  }, [user]);//Refresh every time user is changed

  const handleClick = async () => {
    try {
      if (followed) {
        // If followed put currentUser id in the user and unfollow the Currentuser
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        //else put currentUser id in the user and follow the currentUser
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      //setFollowed opposite f tge followe i.e., if true then false and if false then true
      setFollowed(!followed);
    } catch (err) {
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {/* Map users with Online */}
          {Users.map((u) => (//Passing the props inside the Online
          //user prop can use all the properties of Users
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
      {/* username of the user is not equal to the username of the currentuser then  */}
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {/* If followed then show unfpllow else show follow */}
            {followed ? "Unfollow" : "Follow"}
            {/* This are material icons of minus and plus */}
            {/* If followe show Remove else show Add */}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            {/* Showing city of the user */}
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {/* If user.relationship = 1 show single elseif user.relationship = 2 show married else show - */}
              {user.relationship === 1
                ? "Single"
                : user.relationship === 1
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {/* map friend to it */}
          {friends.map((friend) => (
            <Link
            // use username of the friend
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    // If friend has profilepicture use that profile picture else use PF + "person/noAvatar.png"
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {/* if user exist take to proflerighbar else take to homerightbar */}
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
