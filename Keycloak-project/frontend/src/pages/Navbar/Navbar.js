import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";
const Navbar = () => {
  const { keycloak, initialized } = useKeycloak();

  return (
    <div>
      <div>
        <ul className="navbar">
          <li className="navbar">
            <a href="/">Home</a>
          </li>
          <li className="navbar">
            <a href="/protected">Protected Images</a>
          </li>
          <li className="navbar">
            <a href="/unprotected">Unprotected Posts</a>
          </li>
          <li className="navbar">
            <div>
              {!keycloak.authenticated && (
                <button
                  className="navbar"
                  type="button"
                  onClick={() => keycloak.login()}
                >
                  Login
                </button>
              )}

              {!!keycloak.authenticated && (
                <button
                  className="navbar"
                  type="button"
                  onClick={() => keycloak.logout()}
                >
                  Logout {keycloak.tokenParsed.preferred_username}
                </button>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
