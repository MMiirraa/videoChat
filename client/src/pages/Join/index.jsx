import React from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/index.jsx";
import css from "./Join.module.css";
import { useStore } from "../../context/index.js";
import Button from "../../components/Button/index.jsx";

const Join = () => {
  const store = useStore()
  const userNameRef = React.useRef(null)
  const navigate = useNavigate()

  const join = () => {
    if(userNameRef.current.value.length > 0) {
      store.handleJoin(userNameRef.current.value)
    }
  }

  React.useEffect(() => {
    if(store.isJoin) {
      navigate("/room/1")
    }
  }, [navigate, store.isJoin])

  return(
    <div className={css.join}>
      { 
        store.isFull ? (
          <h1>Room is full</h1>
        ) : (
          <>
            <Input ref={userNameRef} type="text" value="" placeholder="your name? max length 20"/>
            <Button typeStyle="join" type="button" text="JOIN" onClick={join} className="join_btn"/>
          </>
        )
      }
    </div>
  )
}

export default React.memo(Join)
