import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./Posts.css";
const Posts = () => {
  const [posts, setPosts] = useState();
  const backendUnprotectedEndpoint = "http://localhost:4000/frontend/posts";

  useEffect(() => {
    axios
      .get(backendUnprotectedEndpoint)
      .then((result) => {
        setPosts(result.data.posts);
        console.log("Posts", result);
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
              <label htmlFor="author">Author: </label>
              <input type="text" id="author" name="author" />
            </li>
            <li>
              <label htmlFor="title">Title: </label>
              <input type="text" id="title" name="title" />
            </li>
            <li>
              <label htmlFor="content">Content: </label>
              <input type="text" id="content" name="content" />
            </li>
            <li>
              {" "}
              <button
                className="posts"
                type="button"
                onClick={() => {
                  axios.post(backendUnprotectedEndpoint, {
                    body: {
                      author: document.getElementById("author").value,
                      title: document.getElementById("title").value,
                      content: document.getElementById("content").value,
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
      <div className="posts">
        {posts?.map((post) => (
          <div key={post._id}>
            <div className="content">
              Author:{post.author}, Title:{post.title}, {post.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
