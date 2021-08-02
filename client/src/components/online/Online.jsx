import "./online.css";

export default function Online({user}) {//Passing the props user
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img className="rightbarProfileImg" src={PF+user.profilePicture} alt="" />
        <span className="rightbarOnline"></span>
      </div>
      {/* using username in the user */}
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}
