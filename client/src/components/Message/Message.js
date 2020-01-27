import React from "react";
import "./Message.scss";

import { EmojioneV4 } from "react-emoji-render";

function Message({ name, message, src, style }) {
  return (
    <>
      <div className="MessageContainer">
        <div className="imageContainer">
          <img
            src={
              src ||
              "https://lh3.googleusercontent.com/a-/AAuE7mCBl4cvUpr-r5rpbm8lphWlGcZ-KNoNdTReBAhm=s96-c"
            }
            alt="https://www.w3schools.com/w3images/bandmember.jpg"
          ></img>
        </div>
        <div className="Message">
          <p>
            <EmojioneV4
              size={64}
              text={message || "You need to enable JavaScript to run this app."}
            />
          </p>
        </div>
      </div>
    </>
  );
}

export default Message;
