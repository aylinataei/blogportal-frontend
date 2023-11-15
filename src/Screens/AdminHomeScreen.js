import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminHomeScreen.css";
import LogoutButton from "./logout.js";
import { FaPen, FaTrash } from "react-icons/fa";


const AdminHomeScreen = () => {
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const getInvitedUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:8080/api/invitedUsers",
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setInvitedUsers(response.data);
    } catch (error) {
      console.error("Error fetching invited users:", error);
    }
  };

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8080/api/auth/inviteUser",
        {
          email,
          selectedRole: "user",
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      getInvitedUsers();

      setEmail("");
      setInviteSuccess(true);
    } catch (error) {
      console.error("Något gick fel vid skickandet av inbjudan:", error);
    }
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
      setSelectedUserId(null);
    } catch (error) {
      console.error(
        "Något gick fel vid uppdatering av användarens roll:",
        error
      );
    }
  };

  const handlePost = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (editingPostId) {
        await axios.put(
          `http://localhost:8080/api/updatePost/${editingPostId}`,
          {
            title: editTitle,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        setEditingPostId(null);
        setEditTitle("");
        setEditContent("");
      } else {
        await axios.post(
          "http://localhost:8080/api/createPost",
          {
            content,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
      }
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
    setSelectedUserId(userId);
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

  const disableButton = (user) => {
    const userId = localStorage.getItem("loggedInUserId", user.id);
    return String(user.id) === String(userId);
  };

  useEffect(() => {
    getInvitedUsers();
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
          <button className="invite-btn" onClick={handleInvite}>
            Invite
          </button>

          {inviteSuccess && (
            <p style={{ color: "green", fontSize: "10px" }}>
              Invitation sent successfully to email!
            </p>
          )}
        </div>
        <div>
          <button onClick={showInputFieldsHandler}>Add post</button>
        </div>
        {showInputFields && (
          <div className="create-post">
            <textarea
              className="content-field"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button onClick={handlePost}>
              {editingPostId ? "Update post" : "Create post"}
            </button>
          </div>
        )}
        <div>
          {posts.map((post) => (
            <div className="post" key={post.id}>
              {editingPostId === post.id ? (
                <>
                  <textarea
                    placeholder="New content"
                    value={editContent || post.content}
                    onChange={(e) => setEditContent(e.target.value)}
                  ></textarea>
                  <button
                    className="btn-editpost"
                    onClick={() => handlePost(post.id)}
                  >
                    Update post
                  </button>
                  <button
                    className="btn-editpost"
                    onClick={() => setEditingPostId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{post.content}</p>
                  <button
                    className="edit-post"
                    onClick={() => setEditingPostId(post.id)}
                  >
                    <FaPen />
                  </button>
                  <button
                    className="edit-post"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="user-container">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.roles}</td>
                    <td>
                      <button
                        className="button-user"
                        onClick={() => handleEditUserRole(user.id)}
                        disabled={
                          user.email === "admin@admin.com" ||
                          disableButton(user)
                        }
                      >
                        <FaPen />
                      </button>
                      <button
                        className="button-user"
                        disabled={
                          user.email === "admin@admin.com" ||
                          disableButton(user)
                        }
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {selectedUserId && (
          <div>
            <select
              className="select-role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="">Select</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleUpdateUserRole}>Save</button>
          </div>
        )}
        <h5>Invited users</h5>
        <table>
          <thead>
            <tr></tr>
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