import React from "react";
import { useStore } from "../../context";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import css from "./inputChat.module.css"
import ws from "../../socket";

const InputChat = () => {
  const store = useStore()
  const [inputState, setInputState] = React.useState("")
  const navigate = useNavigate()

  const leave = React.useCallback(() => {
    ws.disconnect()
    navigate("/")
  }, [navigate])

  const onEnterPress = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      send(e)
    }
  }
  
  const send = (e) => {
    e.preventDefault()
    store.handleSend(inputState)
    setInputState("")
  }

  return(
    <form className={css.form} onSubmit={send}>
      <textarea 
        onKeyDown={onEnterPress} 
        wrap="soft" 
        className={css.textarea} 
        onChange={(e) => setInputState(e.target.value)} 
        value={inputState}
      />
      <div className={css.actions}>
        <Button typeStyle="chat" type="submit" text="send" onClick={send} className="chat_btn"/>
        <Button typeStyle="chat" type="button" text="LEAVE" onClick={leave} className="chat_btn"/>
      </div>
    </form>
  )
}

export default React.memo(InputChat)
