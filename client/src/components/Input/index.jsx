import React from "react";
import css from "./input.module.css"


const Input = React.forwardRef((props, ref) => {
  const { value, type, placeholder } = props
  const [valueState, setValueState] = React.useState(value)

  return <input
            maxLength="20"
            placeholder={placeholder}
            className={css.fieldInputText}
            ref={ref}
            type={type}
            onChange={(e) => setValueState(e.target.value)}
            value={valueState}
          />
})

export default React.memo(Input)
