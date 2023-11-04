import React, { useState } from 'react';
import axios from 'axios';

const AdminHomeScreen = () => {
  const [email, setEmail] = useState('');

  const handleInvite = async () => {
    try {
      await axios.post('http://localhost:8081/api/auth/inviteUser', { email });
      alert('Inbjudan skickad framgångsrikt via e-post!');
    } catch (error) {
      console.error('Något gick fel vid skickandet av inbjudan:', error);
      alert('Något gick fel vid skickandet av inbjudan.');
    }
  };


  return (
    <div>
      <h1>Admin Home Screen</h1>
      <div>
        <input
          type="email"
          placeholder="Ange e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleInvite}>Invite</button>
      </div>
    </div>
  );
};

export default AdminHomeScreen;
