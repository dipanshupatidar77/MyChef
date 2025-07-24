

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const UserProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = localStorage.getItem('userToken');
//         const res = await axios.get('/api/users/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//         setFormData(res.data);
//       } catch (err) {
//         console.error('Failed to fetch user profile', err);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   const handleChange = e => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//  const handleImageUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const formDataImg = new FormData();
//   formDataImg.append('file', file);
//   //formDataImg.append('upload_preset', 'myUploadPreset'); // ✅ actual upload preset name
//   formDataImg.append('upload_preset', 'mychefpreset'); // use your unsigned preset name

//   try {
//     setUploading(true);
//     const res = await axios.post(
//       'https://api.cloudinary.com/v1_1/dgygctbyo/image/upload', // ✅ actual cloud name
//       formDataImg
//     );

//     setFormData(prev => ({
//       ...prev,
//       profilePicUrl: res.data.secure_url,
//     }));
//     setUploading(false);
//   } catch (error) {
//     console.error('Image upload failed:', error.response?.data || error.message); // ⬅ Better debug log
//     setUploading(false);
//   }
// };

// console.log("Sending profile pic URL to backend:", formData.profilePicUrl);

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem('userToken');
//       await axios.put('/api/users/profile', formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEditMode(false);
//       setUser({ ...user, ...formData });
//     } catch (err) {
//       console.error('Error updating user profile', err);
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="container mt-4">
//       <h2>User Profile</h2>

//       {formData.profilePicUrl && (
//         <img
//           src={formData.profilePicUrl}
//           alt="Profile"
//           style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
//         />
//       )}

//       {editMode ? (
//         <div>
//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Name"
//             className="form-control my-2"
//           />
//           <input
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             placeholder="City"
//             className="form-control my-2"
//           />
//           <input
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             placeholder="Location"
//             className="form-control my-2"
//           />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="form-control my-2"
//           />
//           {uploading && <p>Uploading image...</p>}

//           <button onClick={handleSave} className="btn btn-success mt-2">
//             Save
//           </button>
//         </div>
//       ) : (
//         <div>
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>City:</strong> {user.city}</p>
//           <p><strong>Location:</strong> {user.location}</p>

//           <button onClick={() => setEditMode(true)} className="btn btn-primary">
//             Edit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfilePage;

// src/user/UserProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserProfilePage.css'; // ✅ Add this import

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append('file', file);
    formDataImg.append('upload_preset', 'mychefpreset');

    try {
      setUploading(true);
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dgygctbyo/image/upload',
        formDataImg
      );

      setFormData(prev => ({
        ...prev,
        profilePicUrl: res.data.secure_url,
      }));
      setUploading(false);
    } catch (error) {
      console.error('Image upload failed:', error.response?.data || error.message);
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      setUser({ ...user, ...formData });
    } catch (err) {
      console.error('Error updating user profile', err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-profile-container">
      <h2 className="profile-title">👤 Your Profile</h2>

      <div className="profile-card">
        <div className="profile-img-section">
          {formData.profilePicUrl && (
            <img
              src={formData.profilePicUrl}
              alt="Profile"
              className="profile-pic"
            />
          )}

          {editMode && (
            <div className="upload-box">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {uploading && <p>Uploading image...</p>}
            </div>
          )}
        </div>

        <div className="profile-info">
          {editMode ? (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
              />
              <button className="save-btn" onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Location:</strong> {user.location}</p>
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
