// src/chef/ChefProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ChefProfilePage.css'; //  CSS file for profile

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

//  Reusable ProfileField Component
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
