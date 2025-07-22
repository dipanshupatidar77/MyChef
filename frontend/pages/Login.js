// import React, { useState } from 'react';
// import '../styles/Login.css';
// import axios from 'axios';
// import loginHeroImg from '../assests/login-hero.jpg'; // Adjust path as needed

// const Login = () => {
//   const [role, setRole] = useState('user');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     approvalPassword: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/auth/login', { ...formData, role });

//       alert("Login Successful. Token: " + res.data.token);
//       localStorage.setItem(role === 'chef' ? "chefToken" : "userToken", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       localStorage.setItem("userRole", role);

//       window.location.href = '/';
//     } catch (err) {
//       alert(err.response?.data?.msg || "Login Failed");
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-left">
//         <img src={loginHeroImg} alt="Chef at work" />
//       </div>

//       <div className="login-right">
//         <div className="login-heading">
//           <h1>Welcome back to <span>MyChef</span>!</h1>
//           <p>Log in to book a chef or manage your orders — based on your role!</p>
//         </div>

//         {/* ✅ Role Toggle Buttons */}
//         <div className="role-selection">
//           <button
//             type="button"
//             className={`role-btn ${role === 'user' ? 'active' : ''}`}
//             onClick={() => setRole('user')}
//           >
//             User
//           </button>
//           <button
//             type="button"
//             className={`role-btn ${role === 'chef' ? 'active' : ''}`}
//             onClick={() => setRole('chef')}
//           >
//             Chef
//           </button>
//         </div>

//         <div className="form-box">
//           <form onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               required
//               onChange={handleChange}
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               required
//               onChange={handleChange}
//             />
//             {role === 'chef' && (
//               <input
//                 type="text"
//                 name="approvalPassword"
//                 placeholder="Approval Password"
//                 required
//                 onChange={handleChange}
//               />
//             )}
//             <button type="submit">Login Now</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import loginHeroImg from '../assests/login-hero.jpg'; // Adjust path if needed

const Login = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    approvalPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('/api/auth/login', { ...formData, role });

    // ✅ Show SweetAlert and wait for user confirmation
    await Swal.fire({
      title: 'Login Successful ✅',
      text: `Welcome back, ${res.data.user.name || 'User'}!`,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    // ✅ Save token and redirect only after alert is dismissed
    localStorage.setItem(role === 'chef' ? 'chefToken' : 'userToken', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('userRole', role);

    window.location.href = '/';
  } catch (err) {
    alert(err.response?.data?.msg || 'Login Failed');
  }
};


  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={loginHeroImg} alt="Chef at work" />
      </div>

      <div className="login-right">
        <div className="login-heading">
          <h1>
            Welcome back to <span>MyChef</span>!
          </h1>
          <p>Log in to book a chef or manage your orders — based on your role!</p>
        </div>

        {/* ✅ Role Toggle Buttons */}
        <div className="role-selection">
          <button
            type="button"
            className={`role-btn ${role === 'user' ? 'active' : ''}`}
            onClick={() => setRole('user')}
          >
            User
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'chef' ? 'active' : ''}`}
            onClick={() => setRole('chef')}
          >
            Chef
          </button>
        </div>

        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            {role === 'chef' && (
              <input
                type="text"
                name="approvalPassword"
                placeholder="Approval Password"
                required
                onChange={handleChange}
              />
            )}
            <button type="submit">Login Now</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
