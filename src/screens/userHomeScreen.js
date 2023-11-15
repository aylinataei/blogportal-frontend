import React, { useState, useEffect } from "react";
import axios from "axios";
import LogoutButton from "./logout";

const UserHomeScreen = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get("http://localhost:8080/api/getAll", {
        headers: {
          "x-access-token": token,
        },
      });

      const sortedPosts = response.data.reverse();
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Något gick fel vid hämtning av inlägg:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <LogoutButton />
      <h1>User Home Screen</h1>
      <div>
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHomeScreen;