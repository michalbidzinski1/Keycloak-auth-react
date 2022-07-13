import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const { keycloak } = useKeycloak();

  const logged = keycloak.authenticated;

  return logged ? children : <h1>Not logged in...</h1>;
};

export default PrivateRoute;
