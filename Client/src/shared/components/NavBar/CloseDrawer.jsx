import React from "react";
import ReactDOM  from "react-dom";
import styles from './CloseDrawer.module.css';
const CloseDrawer =(props)=>{
    const content = (<button className={styles.closeDrawer} onClick={props.onClick} style={{position: "absolute",zIndex:3}}>&#10005;</button>);
    return ReactDOM.createPortal(content, document.getElementById("cross-hook"))
}
export default CloseDrawer;