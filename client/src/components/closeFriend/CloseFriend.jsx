import "./closeFriend.css";

export default function CloseFriend({user}) {
  //PF contains the root 
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
    {/* using profilePicture and username in the user */}
      <img className="sidebarFriendImg" src={PF+user.profilePicture} alt="" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}
