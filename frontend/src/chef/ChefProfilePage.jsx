// // src/chef/ChefProfilePage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ChefProfilePage = () => {
//   const [chef, setChef] = useState(null);

//   useEffect(() => {
//     const fetchChefProfile = async () => {
//       try {
//         const token = localStorage.getItem('chefToken');
//         console.log("🐱‍💻 Token being sent:", token); // 👈 ADD THIS

//         const res = await axios.get('/api/chefs/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setChef(res.data);
//       } catch (error) {
//         console.error('Failed to fetch chef profile', error);
//       }
//     };

//     fetchChefProfile();
//   }, []);

//   if (!chef) return <p>Loading profile...</p>;

//   return (
//     <div className="container mt-4">
//       <h2>Your Profile</h2>
//       {chef.profilePicUrl && (
//   <img
//     src={chef.profilePicUrl}
//     alt={`${chef.name}'s profile`}
//     style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
//   />
// )}

//       <p><strong>Name:</strong> {chef.name}</p>
//       <p><strong>Email:</strong> {chef.email}</p>
//       <p><strong>Mobile:</strong> {chef.mobile}</p>
//       <p><strong>Age:</strong> {chef.age}</p>
//       <p><strong>City:</strong> {chef.city}</p>
//       <p><strong>Experience:</strong> {chef.experience} years</p>
//       <p><strong>Dishes:</strong> {chef.dishes?.join(', ')}</p>
//       <p><strong>Specialty:</strong> {chef.specialty?.join(', ')}</p>
//       <p><strong>Service Time:</strong> {chef.serviceTime?.from} - {chef.serviceTime?.to}</p>
//       <p><strong>Charges Per Visit:</strong> ₹{chef.chargesPerVisit}</p>
//     </div>
//   );
// };

// export default ChefProfilePage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ChefProfilePage = () => {
//   const [chef, setChef] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [newProfilePic, setNewProfilePic] = useState(null);

//   useEffect(() => {
//     const fetchChefProfile = async () => {
//       try {
//         const token = localStorage.getItem('chefToken');
//         const res = await axios.get('/api/chefs/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setChef(res.data);
//         setFormData(res.data);
//       } catch (error) {
//         console.error('Failed to fetch chef profile', error);
//       }
//     };

//     fetchChefProfile();
//   }, []);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setNewProfilePic(e.target.files[0]);
//   };

//   const handleSaveChanges = async () => {
//     try {
//       const token = localStorage.getItem('chefToken');
//       const form = new FormData();

//       // Append fields to FormData
//       form.append('name', formData.name);
//       form.append('mobile', formData.mobile);
//       form.append('age', formData.age);
//       form.append('experience', formData.experience);

//       if (newProfilePic) {
//         form.append('profilePic', newProfilePic); // must match multer config
//       }

//       const res = await axios.put('/api/chefs/update-profile', form, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setChef(res.data);
//       setEditMode(false);
//       setNewProfilePic(null);
//     } catch (error) {
//       console.error('Error updating chef profile', error);
//     }
//   };

//   if (!chef) return <p>Loading profile...</p>;

//   return (
//     <div className="container mt-4">
//       <h2>Your Profile</h2>

//       {chef.profilePicUrl && (
//         <img
//           src={
//             newProfilePic
//               ? URL.createObjectURL(newProfilePic)
//               : chef.profilePicUrl
//           }
//           alt={`${chef.name}'s profile`}
//           style={{
//             width: '150px',
//             height: '150px',
//             borderRadius: '50%',
//             objectFit: 'cover',
//             marginBottom: '1rem',
//           }}
//         />
//       )}

//       {editMode && (
//         <div className="mb-3">
//           <label>Change Profile Pic:</label>
//           <input type="file" onChange={handleFileChange} />
//         </div>
//       )}

//       <p>
//         <strong>Name:</strong>{' '}
//         {editMode ? (
//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//           />
//         ) : (
//           chef.name
//         )}
//       </p>

//       <p><strong>Email:</strong> {chef.email}</p>

//       <p>
//         <strong>Mobile:</strong>{' '}
//         {editMode ? (
//           <input
//             name="mobile"
//             value={formData.mobile}
//             onChange={handleInputChange}
//           />
//         ) : (
//           chef.mobile
//         )}
//       </p>

//       <p>
//         <strong>Age:</strong>{' '}
//         {editMode ? (
//           <input
//             name="age"
//             value={formData.age}
//             onChange={handleInputChange}
//             type="number"
//           />
//         ) : (
//           chef.age
//         )}
//       </p>

//       <p>
//         <strong>Experience:</strong>{' '}
//         {editMode ? (
//           <input
//             name="experience"
//             value={formData.experience}
//             onChange={handleInputChange}
//             type="number"
//           />
//         ) : (
//           `${chef.experience} years`
//         )}
//       </p>

//       <p><strong>Dishes:</strong> {chef.dishes?.join(', ')}</p>
//       <p><strong>Specialty:</strong> {chef.specialty?.join(', ')}</p>
//       <p><strong>Service Time:</strong> {chef.serviceTime?.from} - {chef.serviceTime?.to}</p>
//       <p><strong>Charges Per Visit:</strong> ₹{chef.chargesPerVisit}</p>

//       <div className="mt-3">
//         {!editMode ? (
//           <button onClick={() => setEditMode(true)} className="btn btn-primary">
//             Edit Profile
//           </button>
//         ) : (
//           <button onClick={handleSaveChanges} className="btn btn-success">
//             Save Changes
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChefProfilePage;


// src/chef/ChefProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ChefProfilePage.css'; // ✅ CSS file for profile

const ChefProfilePage = () => {
  const [chef, setChef] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newProfilePic, setNewProfilePic] = useState(null);

  useEffect(() => {
    const fetchChefProfile = async () => {
      try {
        const token = localStorage.getItem('chefToken');
        const res = await axios.get('/api/chefs/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChef(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error('Failed to fetch chef profile', error);
      }
    };

    fetchChefProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewProfilePic(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('chefToken');
      const form = new FormData();

      form.append('name', formData.name);
      form.append('mobile', formData.mobile);
      form.append('age', formData.age);
      form.append('experience', formData.experience);

      if (newProfilePic) {
        form.append('profilePic', newProfilePic);
      }

      const res = await axios.put('/api/chefs/update-profile', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setChef(res.data);
      setEditMode(false);
      setNewProfilePic(null);
    } catch (error) {
      console.error('Error updating chef profile', error);
    }
  };

  if (!chef) return <p>Loading profile...</p>;

  return (
    <div className="chef-profile-container">
      <h2 className="profile-title">👨‍🍳 Your Profile</h2>

      <div className="profile-card">
        <div className="profile-img-box">
          <img
            src={newProfilePic ? URL.createObjectURL(newProfilePic) : chef.profilePicUrl}
            alt={`${chef.name}'s profile`}
            className="profile-pic"
          />

          {editMode && (
            <div className="file-upload">
              <label>Change Profile Pic:</label>
              <input type="file" onChange={handleFileChange} />
            </div>
          )}
        </div>

        <div className="profile-details">
          <ProfileField label="Name" value={chef.name} edit={editMode} name="name" onChange={handleInputChange} />
          <ProfileField label="Email" value={chef.email} />
          <ProfileField label="Mobile" value={chef.mobile} edit={editMode} name="mobile" onChange={handleInputChange} />
          <ProfileField label="Age" value={chef.age} edit={editMode} name="age" onChange={handleInputChange} />
          <ProfileField label="Experience" value={`${chef.experience} years`} edit={editMode} name="experience" onChange={handleInputChange} />
          <ProfileField label="Dishes" value={chef.dishes?.join(', ')} />
          <ProfileField label="Specialty" value={chef.specialty?.join(', ')} />
          <ProfileField label="Service Time" value={`${chef.serviceTime?.from} - ${chef.serviceTime?.to}`} />
          <ProfileField label="Charges Per Visit" value={`₹${chef.chargesPerVisit}`} />

          <div className="btn-group">
            {!editMode ? (
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
            ) : (
              <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable ProfileField Component
const ProfileField = ({ label, value, edit, name, onChange }) => {
  return (
    <div className="profile-field">
      <strong>{label}:</strong>{' '}
      {edit ? (
        <input name={name} value={value} onChange={onChange} />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};

export default ChefProfilePage;
