import React from "react";
import "./RoomList.scss";

function RoomList() {
  return (
    <div className="RoomList">
      <div className="Container">
        <div className="list-item">
          <h3>Room Name</h3>
          <h4>0/8</h4>
          <button>Join</button>
        </div>
      </div>
    </div>
  );
}

export default RoomList;
