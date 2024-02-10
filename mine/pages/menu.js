import React from "react";
import styles from "../styles/menu.module.css";
import { Link } from "react-router-dom";

const Menu = ({ handleUserLogout }) => {
  return (
    <div className={styles.menu}>
      <div className={styles.sideDiv}>
        <h2>Pixel Feed</h2>
        <ul className={styles.uiTag}>
          <li className={styles.liTag}>
            <Link to="/" className={styles.menuLink}>
              <img src="/home.png" alt="home" />
              Home
            </Link>
          </li>
          <li className={styles.liTag}>
            <Link to="/search" className={styles.menuLink}>
              <img src="/search.png" alt="search" />
              Search
            </Link>
          </li>
          <li className={styles.liTag}>
            <Link to="/messages" className={styles.menuLink}>
              <img src="/message.png" alt="messages" />
              Messages
            </Link>
          </li>
          <li className={styles.liTag}>
            <Link to="/notifications" className={styles.menuLink}>
              <img src="/notification.png" alt="notifications" />
              Notifications
            </Link>
          </li>
          <li className={styles.liTag}>
            <Link to="/create" className={styles.menuLink}>
              <img src="/create.png" alt="create" />
              Create
            </Link>
          </li>
          <li className={styles.liTag}>
            <Link to="/profile" className={styles.menuLink}>
              <img src="/profile.png" alt="profile" />
              Profile
            </Link>
          </li>
          <li className={styles.liTag}>
            <p className={styles.menuLink} onClick={handleUserLogout}>
              <img src="/logout.png" alt="logout" />
              Logout
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
