import React, { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import { useEffect } from "react";
import "./Images.css";
const Images = () => {
  const [images, setImages] = useState([]);

  const { keycloak } = useKeycloak();
  const backendProtectedEndpoint = "http://localhost:4000/frontend/images";
  useEffect(() => {
    const accessToken = keycloak.token || "";
    keycloak.authenticated &&
      axios
        .get(backendProtectedEndpoint, {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        })
        .then((result) => {
          setImages(result.data.images);
          console.log("Images", result);
          console.log("keycloak", keycloak);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  return (
    <div>
      <div className="form">
        <form id="form">
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
            <li>
              {" "}
              <button
                className="posts"
                type="button"
                onClick={() => {
                  axios.post(backendProtectedEndpoint, {
                    headers: {
                      Authorization: "Bearer " + keycloak.token,
                    },
                    body: {
                      imageUrl: document.getElementById("imageUrl").value,
                      author: document.getElementById("authorImage").value,
                      title: document.getElementById("titleImage").value,
                      description:
                        document.getElementById("descriptionImage").value,
                    },
                  });
                  alert("Dodano");
                  window.location.reload(false);
                }}
              >
                Send{" "}
              </button>
            </li>
          </ul>
        </form>
      </div>
      <div className="center">
        {images?.map((image) => (
          <div className="post" key={image._id}>
            <div className="author" key={image._id}>
              {image.title}
            </div>
            <img className="postImg" src={image.imageUrl} alt={image._id} />
            <div className="postInfo">
              {" "}
              <div className="postDesc">
                {image.author}: {image.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
