import React, { useRef, useEffect } from "react";
import "./Canvas.scss";
import { isMobile } from "react-device-detect";
import CanvasDraw from "react-canvas-draw";

import io from "socket.io-client";

let socket;

function Canvas() {
  const canvas = useRef();

  useEffect(() => {
    socket = io.connect("http://localhost:5000/");

    socket.on("updateData", data => {
      if (canvas && data) {
        canvas.current.loadSaveData(data, true);
      }
    });
  }, []);

  const undo = () => {
    canvas.current.undo();
  };

  return (
    <section className="Canvas">
      {!isMobile ? (
        <div
          onMouseUp={() => {
            socket.emit("drawingData", canvas.current.getSaveData());
          }}
        >
          <CanvasDraw
            ref={canvas}
            canvasWidth={1200}
            canvasHeight={550}
            disabled={false}
            lazyRadius={0}
            hideInterface={false}
          />
          <button onClick={undo}>Undo</button>
        </div>
      ) : (
        <h1>Mobile not supported</h1>
      )}
    </section>
  );
}

export default Canvas;
