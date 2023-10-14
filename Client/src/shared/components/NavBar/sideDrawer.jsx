import React from "react";
import ReactDOM from "react-dom";
import styles from "./sideDrawer.module.css";
import { CSSTransition } from "react-transition-group";

const SideDrawer = (props) => {
  const content = (
    <CSSTransition in={props.show} timeout={400} classNames="slide-in-left" mountOnEnter unmountOnExit>
      <div onClick= {props.onClick} className={styles.sideDrawer}>{props.children}</div>
    </CSSTransition>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("sideDrawer-hook")
  );
};

export default SideDrawer;
