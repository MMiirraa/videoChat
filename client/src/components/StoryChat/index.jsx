import React from "react";
import { useStore } from "../../context";
import css from "./StoryChat.module.css"
import cn from "classnames"


const StoryChat = () => {
  const store = useStore()
  const lastMessageRef = React.useRef(null)


  const renderMessages = React.useCallback((el, i) => {
    const isMyMessage = el.user.name === store.user.name;

    const messageClassName = cn(css.message, {
      [css.myMessage]: isMyMessage,
    })
    return <li key={i} className={messageClassName}>
            <p>{el.message}</p>
          </li>
  }, [store.user.name])

  React.useEffect(() => {
    lastMessageRef.current.scrollIntoView({block: "end", behavior: "smooth"})
  }, [store.messages])

  return(
    <div className={css.StoryChat}>
      <ul className={css.ul}>
        { store.messages && store.messages.map(renderMessages) }
        <li ref={lastMessageRef}></li>
      </ul>
    </div>
  )
}

export default React.memo(StoryChat)
