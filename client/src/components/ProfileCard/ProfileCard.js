import React from "react";
import "./ProfileCard.scss";
function ProfileCard({ src, points, drawing }) {
  let border = drawing ? "2px solid white" : "none";

  return (
    <div className="ProfileCard">
      <div className="imageContainer" style={{ border: border }}>
        <img
          alt="avatar"
          src={
            src ||
            "https://lh3.googleusercontent.com/-ExcCE_u-6AA/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3re0f6aLElaFPaWzTzCEPQKovJ8fsw/s96-c/photo.jpg"
          }
        ></img>
      </div>
      <p>{points || 0}pts</p>
    </div>
  );
}

export default ProfileCard;