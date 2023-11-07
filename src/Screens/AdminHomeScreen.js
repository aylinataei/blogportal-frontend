import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminHomeScreen.css";

const AdminHomeScreen = () => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);
  const [users, setUsers] = useState([]);


  const handleInvite = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/inviteUser", {
        email,
        selectedRole,
      });
      setInviteSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Något gick fel vid skickandet av inbjudan:", error);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value); // Uppdaterar vald roll
  };

  const handlePost = async () => {
    try {
      await axios.post("http://localhost:8080/api/createPost", {
        title,
        content,
      });
      setTitle("");
      setContent("");
      getPosts();
    } catch (error) {
      console.error("Något gick fel vid postningen:", error);
    }
  };

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/getAll");
      const sortedPosts = response.data.reverse();
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Något gick fel vid hämtning av inlägg:", error);
    }
  };

  const showInputFieldsHandler = () => {
    setShowInputFields(true);
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    getPosts();
    // Hämta alla användare när komponenten laddas
    axios.get("http://localhost:8080/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Något gick fel vid hämtning av användare:", error);
      });
  }, []);


  return (
    <div className="container">
      <h1>Admin Home Screen</h1>
      <div className="container-register">
        <input
          type="email"
          placeholder="Ange e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={selectedRole} onChange={handleRoleChange}>
          <option value="user">Användare</option>
          <option value="admin">Admin</option>
        </select>
        <button className="invite-btn" onClick={handleInvite}>
          Invite
        </button>
        {inviteSuccess && (
          <p style={{ color: "green" }}>
            Inbjudan skickad framgångsrikt via e-post!
          </p>
        )}
      </div>
      <div>
        <button onClick={showInputFieldsHandler}>Lägg till inlägg</button>
      </div>
      {showInputFields && (
        <div>
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Innehåll"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <button onClick={handlePost}>Skapa Inlägg</button>
        </div>
      )}
      <div>
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Alla Användare:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username} - {user.email}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default AdminHomeScreen;