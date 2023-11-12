import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminHomeScreen.css";
import LogoutButton from "./logout.js";
import { FaTrash } from "react-icons/fa";

const AdminHomeScreen = () => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [newRole, setNewRole] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [invitedUsers, setInvitedUsers] = useState([]);

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8080/api/auth/inviteUser",
        {
          email,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      setInvitedUsers([...invitedUsers, { email, id: Date.now() }]);
      setInviteSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Något gick fel vid skickandet av inbjudan:", error);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleUpdateUserRole = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:8080/api/updateUserRole/${selectedUserId}`,
        { roles: [newRole] },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      const updatedUsers = users.map((user) => {
        if (user.id === selectedUserId) {
          user.roles = [newRole];
        }
        return user;
      });
      setUsers(updatedUsers);
      setSelectedUserId(null); // Nollställ vald användare
    } catch (error) {
      console.error("Något gick fel vid uppdatering av användarens roll:", error);
    }
  };

  const handlePost = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8080/api/createPost",
        {
          title,
          content,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setTitle("");
      setContent("");
      getPosts();
    } catch (error) {
      console.error("Något gick fel vid postningen:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8080/api/deleteUser/${userId}`, {
        headers: {
          "x-access-token": token,
        },
      });

      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Något gick fel vid borttagning av användare:", error);
    }
  };

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

  const showInputFieldsHandler = () => {
    setShowInputFields(true);
  };


  const handleEditUserRole = (userId) => {
    setSelectedUserId(userId); // Spara användarens id som har valts
  };



  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`http://localhost:8080/api/deletePost/${postId}`, {
        headers: {
          "x-access-token": token,
        },
      });

      getPosts();
    } catch (error) {
      console.error("Något gick fel vid borttagning av inlägg:", error);
    }
  };

  useEffect(() => {
    getPosts();
    axios
      .get("http://localhost:8080/api/users", {
        headers: {
          "x-access-token": localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("An error occurred while fetching users:", error);
      });
  }, []);

  return (
    <div className="container">
      <LogoutButton />
      <h1>Admin Home Screen</h1>
      <div className="container-register">
        <input
          type="email"
          placeholder="Ange e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="container-invite">
          <select
            className="select-role"
            value={selectedRole}
            onChange={handleRoleChange}
          >
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
            <input className="content-title"
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea className="content-field"
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
              {/* <button
                className="edit-post"
                onClick={() => handleEditPost(post.title, post.content)}
              >
                <FaPen />
              </button> */}
              <button
                className="edit-post"
                onClick={() => handleDeletePost(post.id)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div>
          <h4>Användare</h4>
          <table>
            <thead>
              <tr>
                <th>Användarnamn</th>
                <th>E-post</th>
                <th>Roll</th>
                <th>Åtgärd</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.roles ? user.roles.join(", ") : "Inga roller"}</td>
                  <td>
                    <button onClick={() => handleEditUserRole(user.id)}>
                      Ändra roll
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)}>
                      Ta bort användare
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedUserId && (
          <div>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="user">Användare</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleUpdateUserRole}>Spara roll</button>
          </div>
        )}
        <h4>Inbjudna Användare</h4>
        <table>
          <thead>
            <tr>
              <th>E-post</th>
            </tr>
          </thead>
          <tbody>
            {invitedUsers.map((invitedUser) => (
              <tr key={invitedUser.id}>
                <td>{invitedUser.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHomeScreen;





