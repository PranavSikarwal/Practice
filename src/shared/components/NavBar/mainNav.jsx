import React, { useState } from "react";
import styles from "./mainNav.module.css";
import { Link } from "react-router-dom";
import NavLinks from "./navLinks";
import SideDrawer from "./sideDrawer";
import CloseDrawer from "./CloseDrawer";
const MainNav = (props) => {
  const [isDrawer, setIsDrawer] = useState(false);
  const onIsDrawerOpenHandler = () => {
    setIsDrawer(true);
  };
  const onIsDrawerCloseHandler = () => {
    setIsDrawer(false);
  };

  return (
    <>
      <SideDrawer show={isDrawer} onClick={onIsDrawerCloseHandler}>
        <NavLinks className={styles.linksDrawer} />
        {isDrawer && <CloseDrawer onClick={onIsDrawerCloseHandler} />}
      </SideDrawer>
      <div className={styles.header}>
        <button onClick={onIsDrawerOpenHandler} className={styles.sideDrawer}>
          &#9776;
        </button>
        <h1 className={styles.title}>
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className={styles.navLinks}>
          <NavLinks className="displayNone" />
        </nav>
      </div>
    </>
  );
};

export default MainNav;
