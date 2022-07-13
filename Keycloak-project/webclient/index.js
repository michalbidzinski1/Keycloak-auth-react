const express = require("express");
const axios = require("axios");
const { param } = require("express/lib/request");
const app = express();

const appPort = 5001;

const authEndpoint =
  "http://localhost:8080/realms/myapprealm/protocol/openid-connect/auth";
const tokenEndpoint =
  "http://localhost:8080/realms/myapprealm/protocol/openid-connect/token";

const apiProtectedEnpoint = "http://localhost:4000/web/images";
const apiUnprotectedEndpoint = "http://localhost:4000/web/posts";

const clientId = "webclient";
const clientSecret = "9vsZb1RRGahXT6ZwkZ6hfdLLRHvqLafq";

const codeVerifier = "73f011530319ba13bc472c41c09eda148ac7b8b0b9dfd7757c87ac8a";
const codeChallenge = "RA1Bj7hMSrfbNH3bXXK4UkL5K-C1fcSqRQ0TZysTtw4";

const redirectUri = "http://localhost:5001/redirect";

const authRequest = `${authEndpoint}?
response_type=code&
client_id=${clientId}&
state=1234&
redirect_uri=${redirectUri}&
code_challenge=${codeChallenge}&
code_challenge_method=S256`;

app.use((req, res, next) => {
  console.log("----HEADERS--");
  console.log(req.headers);
  console.log("----PARAMS--");
  console.log(req.query);
  next();
});

app.get("/", (req, res) => {
  return axios
    .get(apiUnprotectedEndpoint)
    .then((result) => {
      res.set("Content-Type", "text/html");
      res.send(`
      <!DOCTYPE html>      
       <body>
       <h2>Welcome to my app</h2>
      <div>
      <a href="${authRequest}">Please Login</a>
      </div>
      <p>Unprotected: ${
        result.data.posts
          ? result.data.posts.map((e) => e.title)
          : "No unprotected resources"
      }</p>
      <form id="form" action="http://localhost:4000/web/posts" method="post" enctype='application/x-www-form-urlencoded'>
        <ul>
        <li>
        <label for="author">Author: </label>
        <input type="text" id="author" name="author"/>
        </li>
        <li>
        <label for="title">Title: </label>
        <input type="text" id="title" name="title"/>
        </li>
        <li>
        <label for="content">Content: </label>
        <input type="text" id="content" name="content"/>
        </li>
        <li >
        <button type="submit"  >Add </button></li>
        </ul>
        </form>
       </body>
       </html>
       `);
    })
    .catch((error) => {
      console.log(error);
      res.set("Content-Type", "text/html");
      res.send(`
      <!DOCTYPE html>
       <body>
       <h2>Error</h2>
       </body>
      </html>
      `);
    });
});

app.get("/redirect", (req, res) => {
  const params = new URLSearchParams();

  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", redirectUri);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("code_verifier", codeVerifier);
  params.append("code", req.query.code);

  return axios
    .post(tokenEndpoint, params)
    .then((result) => {
      console.log();
      accessToken = result.data.access_token || "";
      console.log(accessToken);
      return axios.get(apiProtectedEnpoint, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
    })
    .then((result) => {
      console.log(result);
      let success = true;
      if (!result) {
        success = false;
      }
      res.set("Content-Type", "text/html");
      res.send(`
        <!DOCTYPE html>
         <body>
        <h2>Success? ${success}</h2>
        <p>Protected: ${
          result.data.images
            ? result.data.images.map((image) => image.title)
            : "no protected rescources"
        }</p>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script async>
        
        function postFunction() {
                object = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ${accessToken}'
                    }
                }
            axios.post('http://localhost:4000/web/images', object)
          }
        </script>
         <body>
        <h2>Success? ${success}</h2>
        <form >
        <ul>
        <li>
        <label htmlFor="imageUrl">Image: </label>
        <input type="url" id="imageUrl" name="imageUrl" />
      </li>
      <li>
        <label htmlFor="author">Author: </label>
        <input type="text" id="authorImage" name="author" />
      </li>
      <li>
        <label htmlFor="title">Title: </label>
        <input type="text" id="titleImage" name="title" />
      </li>

      <li>
        <label htmlFor="description">Description: </label>
        <input type="text" id="descriptionImage" name="description" />
      </li>
        </ul>
        <li class="button">
        <button type="button" onClick="postFunction()">Add </button></li>
        </form>
         </body>
         </html>
         `);
    })
    .catch((error) => {
      console.log(error);
      res.set("Content-Type", "text/html");
      res.send(`
        <!DOCTYPE html>
         <body>
         <h2>Error</h2>
         </body>
        </html>
        `);
    });
});

app.listen(appPort, (err) => {
  console.log(`App listening on port ${appPort}`);
});
