import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);//Import user from the AuthContext
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();//Prevents page from refreshing
    const newPost = {
      userId: user._id,//userId is the id of the user
      desc: desc.current.value,//use current value of desc
    };
    if (file) {
      const data = new FormData();//Creating the new form
      const fileName = Date.now() + file.name;//Setting filename of the post to currentdate + filename
      //As each post have same filename but date will be different so each filename will be different 
      data.append("name", fileName);//Appending fileName to the data with name "name" 
      data.append("file", file);//appending file to the data with name "file"
      newPost.img = fileName;//setting newpost.img to the fileName
      console.log(newPost);
      try {
        await axios.post("/upload", data);//post the post in the data
      } catch (err) {}
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload();//Show the post
    } catch (err) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              // If user has profilepicture use that profile picture else use PF + "person/noAvatar.png"
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="shareInput"
            ref={desc}//Passing ref as desc it will be used as current value when we write
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            {/* Onclick set file to null or remove the post */}
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        {/* onSubmit use SubmitHandler function */}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                // setFile to e.target.files of 0 index
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
