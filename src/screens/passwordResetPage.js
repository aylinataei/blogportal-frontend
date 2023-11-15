import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateUserWithPassword = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [setJwtToken] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const myUrl = new URL(window.location.toLocaleString()).searchParams;
  const invitationToken = myUrl.get("invitationToken");

  const navigate = useNavigate(); // Lägg till navigationskroken

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(e.target.value)) {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleCreateUser = async () => {
    if (password === confirmPassword) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(password)) {
        setPasswordError("Lösenordet måste vara minst 8 tecken långt och innehålla minst en stor bokstav, en siffra och ett specialtecken (@$!%*?&).");
        return;
      }

      try {
        const response = await axios.post("http://localhost:8080/api/createUserWithPassword", {
          token: invitationToken,
          username: username,
          password: password,
        });

        const token = localStorage.getItem("accessToken");
        await axios.delete("http://localhost:8080/api/removeInvitedUser", {
          data:
          {
            token: invitationToken,
          },
          headers: {
            "x-access-token": token,
          },
        });

        const newJwtToken = response.data.token;
        setJwtToken(newJwtToken);
        setCreateSuccess(true);

        // Navigera till loginsidan
        navigate("/"); // Byt ut "/" mot den faktiska sökvägen till din loginsida
      } catch (error) {
        console.error("Något gick fel vid skapandet av användaren:", error);
      }
    }
  };

  return (
    <div>
      <h2>Ange ditt användarnamn och lösenord</h2>
      <input
        type="text"
        placeholder="Användarnamn"
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={handlePasswordChange}
      />
      <input
        type="password"
        placeholder="Bekräfta lösenord"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
      />
      {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
      <button onClick={handleCreateUser}>Skapa användare</button>
      {createSuccess && (
        <p style={{ color: "green" }}>
          Användaren har skapats framgångsrikt med det angivna användarnamnet och lösenordet!
        </p>
      )}
    </div>
  );
};

export default CreateUserWithPassword;
