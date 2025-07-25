// // src/admin/AdminLogin.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//   '/api/admin/login',
//   { email, password },
//   {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   }
// );

//       if (res.data.token) {
//         localStorage.setItem('adminToken', res.data.token);
//         navigate('/admin/dashboard');
//       }
//     }catch (err) {
//   console.error("Login error:", err.response?.data || err.message);
//   alert(err.response?.data?.msg || 'Invalid credentials');
// }

//   };

//   return (
//     <div>
//       <h1>Welcome Boss </h1>
//       <h3>Admin Login</h3>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Admin Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         /><br />
//         <input
//           type="password"
//           placeholder="Admin Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         /><br />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // ✅ Styling file

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/api/admin/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Invalid credentials');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1>Welcome, <span className="highlight">Boss</span></h1>
        <p className="sub-text">Secure Admin Login Panel</p>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
