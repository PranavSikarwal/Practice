import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navLinks.module.css';

const navlinks = (props) => {
    return (
        <ul className={styles.NavLink+ " "+ props.className}>
        <li>
            <NavLink to="/" activeClassName={styles.active} exact>ALL USERS</NavLink>
        </li>
        <li>
        <NavLink to="/u1/places" activeClassName={styles.active}>MY PLACES</NavLink>
        </li>
        <li>
            <NavLink to="/places/new" activeClassName={styles.active}>ADD PLACE</NavLink>
        </li>
        <li>
            <NavLink  to="/auth" activeClassName={styles.active}>AUTH</NavLink>
        </li>
        </ul>
    );
}

export default navlinks;