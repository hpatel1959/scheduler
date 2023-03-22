import React from "react";
import "components/Button.scss";
import classNames from "classnames";

export default function Button(props) {
   const { onClick, disabled } = props;
   let buttonClass = classNames("button",{
      "button--confirm": props.confirm,
      "button--danger": props.danger
   });

   return (
      <button onClick={onClick} disabled={disabled} className={buttonClass}>
         {props.children}
      </button>
   );
}
