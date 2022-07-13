import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import HomePage from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedPage from "./pages/ProtectedPage";
import Images from "./pages/Images/Images";
import Posts from "./pages/Posts/Posts";
import Navbar from "./pages/Navbar/Navbar";
function App() {
  return (
    <div>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          pkceMethod: "S256",
        }}
      >
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/unprotected" element={<Posts />} />
            <Route
              path="/protected"
              element={
                <ProtectedPage>
                  <Images />
                </ProtectedPage>
              }
            />
          </Routes>
        </BrowserRouter>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
