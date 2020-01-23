import React from "react";
import "./ToolBar.scss";
import { useSelector } from "react-redux";

function ToolBar({ canvasRef, handleMouseDown }) {
  const canDraw = useSelector(state => state.canDrawReducer);

  const handleUndo = () => {
    canvasRef.current.undo();
    handleMouseDown();
  };

  const handleClear = () => {
    canvasRef.current.clear();
    handleMouseDown();
  };

  return (
    <React.Fragment>
      {canDraw && (
        <div className="ToolBar">
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleUndo}>Undo</button>
        </div>
      )}
    </React.Fragment>
  );
}

export default ToolBar;
