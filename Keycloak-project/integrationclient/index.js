const express = require("express");
const axios = require("axios");
const { param } = require("express/lib/request");

const app = express();
app.use(express.json());

const appPort = 6000;

const tokenEndpoint =
  "http://localhost:8080/realms/myapprealm/protocol/openid-connect/token";

const apiProtectedEnpoint = "http://localhost:4000/integration/images";
const apiUnprotectedEndpoint = "http://localhost:4000/integration/posts";

const clientId = "backend";
const clientSecret = "dVcNnmSzNmNMC5qNGULg25PRVE5OQHsS";

app.use((req, res, next) => {
  console.log("----HEADERS--");
  console.log(req.headers);
  console.log("----PARAMS--");
  console.log(req.query);
  next();
});

app.get("/getprotected", (req, res) => {
  const params = new URLSearchParams();

  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  return axios
    .post(tokenEndpoint, params)
    .then((result) => {
      accessToken = result.data.access_token || "";
      return axios.get(apiProtectedEnpoint, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
    })
    .then((result) => {
      res.set("Content-Type", "application/json");
      res.send({
        data: result.data.images,
      });
    })
    .catch((error) => {
      console.log("Integration error", error);
      res.set("Content-Type", "text/html");
      res.send({
        error,
      });
    });
});

app.post("/postprotected", (req, res) => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  return axios
    .post(tokenEndpoint, params)
    .then((result) => {
      accessToken = result.data.access_token || "";
      console.log(req.body);
      return axios.post(apiProtectedEnpoint, {
        headers: { Authorization: "Bearer " + accessToken },
        body: req.body,
      });
    })
    .then((result) => {
      res.set("Content-Type", "application/json");
      res.send("image added");
    })
    .catch((error) => {
      console.log("Integration error", error);
      res.set("Content-Type", "text/html");
      res.send({ error });
    });
});

app.get("/getunprotected", (req, res) => {
  return axios
    .get(apiUnprotectedEndpoint)
    .then((result) => {
      res.set("Content-Type", "application/json");
      res.send({
        data: result.data.posts,
      });
    })
    .catch((error) => {
      res.set("Content-Type", "text/html");
      res.send({
        error,
      });
    });
});

app.post("/postunprotected", (req, res) => {
  console.log(req.body);
  return axios
    .post(apiUnprotectedEndpoint, {
      body: req.body,
    })
    .then((result) => {
      res.set("Content-Type", "application/json");
      res.send("post added");
    })
    .catch((error) => {
      console.log(error);
      res.set("Content-Type", "text/html");
      res.send({ error });
    });
});

app.listen(appPort, (err) => {
  console.log(`App listening on port ${appPort}`);
});
