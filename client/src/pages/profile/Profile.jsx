import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function Profile() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  //passing user as a object
  const [user, setUser] = useState({});
  //Return userrname of the params for the route rendered
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);//fetch this
      setUser(res.data);//set res.dats in the setUser fetched from the above
    };
    // We cant use async in useEffect therefore we created new async function inside useEffect and called it
    fetchUser();
  }, [username]);//Refreshing each time usrname is changed

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  // If there is coverpicture use that else use PF + "person/noCover.png"
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  // If there is profilepicture use that else use PF + "person/noAvatar.png"
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              {/* use user.username and user.desc */}
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            {/* Passing props in feed and rightbar */}
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
