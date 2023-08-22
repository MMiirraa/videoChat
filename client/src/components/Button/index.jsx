import React from "react";
import css from "./button.module.css"
import cn from "classnames"

const Button = (props) => {
  const { onClick, text, type, typeStyle } = props
  
  const buttonClassName = cn(css.custom_btn, css.btn, {
    [css.btn_chat]: typeStyle === 'chat',
    [css.btn_join]: typeStyle === 'join'
  })

  return <button 
          className={buttonClassName} 
          type={type} 
          onClick={onClick}
        >
          {text}
        </button>
}

export default React.memo(Button)
