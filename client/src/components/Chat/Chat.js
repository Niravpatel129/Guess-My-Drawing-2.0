import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../context";
import Message from "../Message/Message";
import "./Chat.scss";
const poof = new Audio(
  "https://raw.githubusercontent.com/Niravpatel129/World-Shooter-game-browser-multiplayer-online-/master/public/assets/poof.mp3"
);

function Chat() {
  let { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const [msg, addMsg] = useState([]);
  const [input, changeInput] = useState("");
  const [drawWord, setDrawWord] = useState("");
  const localStorageData = JSON.parse(localStorage.getItem("loginUserInfo"));

  const { room } = useSelector(state => state.contactReducer);
  const canDraw = useSelector(state => state.canDrawReducer);

  const messagesRef = useRef();

  useEffect(() => {
    socket.on("sendTime", res => {
      const draw = res.find(i => i.roomId === room);
      setDrawWord(draw?.gamedata.word);
    });
  }, [room, socket, drawWord]);

  useEffect(() => {
    socket.on("updateMessage", res => {
      addMsg(res);
    });

    return () => {
      socket.off();
    };
  }, [socket]);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  });

  const submitMessage = e => {
    if (e.charCode === 13) {
      if (input) {
        poof.play();
        if (input.toUpperCase().includes(drawWord.toUpperCase())) {
          socket.emit("guessedCorrect", { user: localStorageData, room });
          dispatch({ type: "SET_GUESS", payload: true });
          dispatch({ type: "SET_NOTIFICATION", payload: true });
          dispatch({ type: "SET_MESSAGE", payload: `You gussed the word! ` });

          socket.emit("chatMessage", {
            name: localStorageData,
            room,
            input: ":star:CORRECT:star:"
          });
        } else {
          socket.emit("chatMessage", { name: localStorageData, room, input });
        }
      }
      changeInput("");
    }
  };

  const renderMessage = () => {
    let style;
    if (msg)
      return msg.map((e, index) => {
        if (e.message === ":star::star::star:CORRECT:star::star::star:") {
          style = { backgroundColor: "#84BAEE" };
        } else if (!e.name.name) {
          style = { backgroundColor: "#EDA1A1", fontWeight: 900 };
        } else {
          style = {};
        }

        return (
          <Message
            src={e.name.imageUrl}
            name={e.name.name}
            message={e.message}
            style={style}
            key={index}
          />
        );
      });
  };

  const Chat = () => {
    let placeholder = "Type here";
    if (canDraw) {
      placeholder = "You are drawing!";
    }
    return (
      <div className="Chat">
        <div className="title">
          <h1>ChatBox</h1>
        </div>
        <div className="messages" ref={messagesRef}>
          {renderMessage()}
        </div>
        <input
          value={input}
          onChange={e => changeInput(e.target.value)}
          onKeyPress={submitMessage}
          placeholder={placeholder}
          disabled={canDraw}
        ></input>
      </div>
    );
  };

  return <React.Fragment>{Chat()}</React.Fragment>;
}

export default Chat;
