import React, { useEffect } from "react";
import "./NotificationModule.scss";
import { useSelector, useDispatch } from "react-redux";
function NotificationModule() {
  const visibleStatus = useSelector(state => state.notificationDisplayReducer);

  console.log(visibleStatus);
  const visiblity = visibleStatus ? "visible" : "hidden";
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "SET_NOTIFICATION", payload: false });
    }, 2000);
  }, [dispatch]);

  return (
    <div className="NotificationModule" style={{ visibility: visiblity }}>
      <div className="inside">
        <h1>Bubble Plop</h1>
      </div>
    </div>
  );
}

export default NotificationModule;
