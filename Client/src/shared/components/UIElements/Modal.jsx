import React from "react";
import styles from "./Modal.module.css";
import ReactDOM from "react-dom";
import CloseDrawer from '../NavBar/CloseDrawer';
import { CSSTransition } from "react-transition-group";

const ModalOverlay = (props) => {
  const content = (
    <div className={props.className + " " + styles.modal}>
      <header className={props.headerClass + " " + styles.header}>
        <h2>{props.header}</h2>
      </header>
      <form
        className={props.formClass + " " + styles.form}
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={props.modalClass + " " + styles.content}>
          {props.children}
        </div>
        <footer style={{display: "flex", flexDirection:"row", alignItems:"center", justifyContent:"center"}} className={props.footerCLass + " " + styles.footer}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = props => {
  return(<>
    {props.show && <CloseDrawer onClick = {props.onClick} />} 
    <CSSTransition in={props.show} timeout={200} mountOnEnter unmountOnExit classNames="modal">
      <ModalOverlay {...props}/>
    </CSSTransition>
  </>);
}

export default Modal;