import React, { useState } from 'react';
import '../styles/Register.css';
import registerImg from '../assests/register.jpg';
//import Swal from 'sweetalert2';

import axios from 'axios';

const dishCategories = {
  gujarati: ['Thepla', 'Khaman', 'Fafda', 'Undhiyu'],
  marathi: ['Puran Poli', 'Vada Pav', 'Misal Pav'],
  rajasthani: ['Dal Baati', 'Gatte ki Sabzi', 'Laal Maas'],
  chinese: ['Manchurian', 'Hakka Noodles', 'Spring Roll'],
};

const Register = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    location: '',
    profilePic: null,
    mobile: '',
    experience: '',
    age: '',
    specialty: [],
    dishes: [],
    chargesPerVisit: '',
    serviceTimeFrom: '',
    serviceTimeTo: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSpecialtyChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    setFormData((prev) => {
      const newSpecialties = checked
        ? [...prev.specialty, value]
        : prev.specialty.filter((s) => s !== value);

      const updatedDishes = prev.dishes.filter((dish) =>
        newSpecialties.some((sp) => dishCategories[sp]?.includes(dish))
      );

      return {
        ...prev,
        specialty: newSpecialties,
        dishes: updatedDishes,
      };
    });
  };

  const handleDishChange = (dish, checked) => {
    setFormData((prev) => ({
      ...prev,
      dishes: checked
        ? [...prev.dishes, dish]
        : prev.dishes.filter((d) => d !== dish),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (role === 'user') {
        if (['name', 'email', 'password', 'city', 'location', 'profilePic'].includes(key)) {
          data.append(key, value);
        }
      } else {
        if (key === 'dishes' || key === 'specialty') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      }
    });

    try {
      const url = role === 'user' ? '/api/auth/register-user' : '/api/chefs/register-chef';
      await axios.post(url, data);
      alert(`${role} registered successfully!`);
    } catch (error) {
      alert(error.response?.data?.msg || 'Registration failed');
    }
  };




  return (
    <div className="register-wrapper">
      <div className="register-left">
        <img src={registerImg} alt="Register hero" />
      </div>

      <div className="register-right">
        <h2>Join <span className="text-highlight">MyChef</span> Today</h2>
        <p className="register-subtext">Whether you're a hungry host or a culinary hero, we've got a spot just for you.</p>

        {/* ✅ Role selection buttons */}
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

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <input type="text" name="city" placeholder="City" required onChange={handleChange} />
          <input type="text" name="location" placeholder="Location" required onChange={handleChange} />
          <input type="file" name="profilePic" required onChange={handleChange} />

          {role === 'chef' && (
            <>
              <input type="text" name="mobile" placeholder="Mobile" required onChange={handleChange} />
              <input type="number" name="experience" placeholder="Experience (years)" required onChange={handleChange} />
              <input type="number" name="age" placeholder="Age" required onChange={handleChange} />

              <div className="form-group">
                <label>Select Specialties:</label>
                <div className="checkbox-container">
                  {Object.keys(dishCategories).map((cuisine) => (
                    <label key={cuisine}>
                      <input
                        type="checkbox"
                        value={cuisine}
                        checked={formData.specialty.includes(cuisine)}
                        onChange={handleSpecialtyChange}
                      />
                      {cuisine}
                    </label>
                  ))}
                </div>
              </div>

              {/* {formData.specialty.length > 0 && (
                <div className="form-group">
                  <label>Select Dishes:</label>
                  <div className="checkbox-container">
                    {formData.specialty.flatMap((sp) => dishCategories[sp] || []).map((dish) => (
                      <label key={dish}>
                        <input
                          type="checkbox"
                          value={dish}
                          checked={formData.dishes.includes(dish)}
                          onChange={(e) => handleDishChange(dish, e.target.checked)}
                        />
                        {dish}
                      </label>
                    ))}
                  </div>
                </div>
              )} */}

              {formData.specialty.length > 0 && (
  <div className="form-group">
    <label>Select Dishes:</label>
    <div className="checkbox-container">
      {formData.specialty.map((sp, index) => (
        <div key={sp} style={{ marginBottom: '12px' }}>
          <strong style={{ textTransform: 'capitalize' }}>
            {index + 1}. {sp} Dishes:
          </strong>
          <div style={{ marginTop: '6px', marginLeft: '10px' }}>
            {(dishCategories[sp] || []).map((dish) => (
              <label
                key={dish}
                style={{
                  display: 'inline-block',
                  marginRight: '15px',
                  marginBottom: '6px',
                }}
              >
                <input
                  type="checkbox"
                  value={dish}
                  checked={formData.dishes.includes(dish)}
                  onChange={(e) => handleDishChange(dish, e.target.checked)}
                />
                {dish}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}


              <input type="number" name="chargesPerVisit" placeholder="Charges per Visit" required onChange={handleChange} />
              <input type="text" name="serviceTimeFrom" placeholder="Service Time From (e.g., 9AM)" required onChange={handleChange} />
              <input type="text" name="serviceTimeTo" placeholder="Service Time To (e.g., 6PM)" required onChange={handleChange} />
            </>
          )}
          <button type="submit">Register Now</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
