import React, { useRef, useEffect, useContext } from "react";

import { useSelector } from "react-redux";

import "./Canvas.scss";
import CanvasDraw from "react-canvas-draw";

import Chat from "../Chat/Chat";
import SocketContext from "../../context";

// let socket;

function Canvas() {
  let { socket } = useContext(SocketContext);
  const loginInfo = useSelector(state => state.userInfoReducer);

  const { name, room } = useSelector(state => state.contactReducer);

  const canvas = useRef();

  useEffect(() => {
    socket.emit("join", { name, room, loginInfo }, () => {
      socket.emit("disconnect");
      alert("Error");
      socket.off();
    });

    socket.on("updateData", data => {
      if (canvas.current && data) {
        canvas.current.loadSaveData(data, true);
      }
    });
  }, [room, name, socket, loginInfo]);

  return (
    <section className="Canvas">
      <div className="Container">
        <Chat socket={socket} />
        <div
          className="CanvasContainer"
          onMouseUp={() => {
            socket.emit("drawingData", {
              data: canvas.current.getSaveData(),
              room
            });
          }}
        >
          <CanvasDraw
            ref={canvas}
            disabled={false}
            brushRadius={6}
            canvasWidth={900}
            canvasHeight={600}
            lazyRadius={0}
            hideInterface={false}
          />
        </div>
      </div>
    </section>
  );
}

export default Canvas;
