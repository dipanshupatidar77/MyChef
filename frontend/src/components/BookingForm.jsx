


import React, { useState, useEffect } from 'react';
import '../styles/bookingForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingForm = ({ chefId }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      const parsedUser = userData && userData !== "undefined" ? JSON.parse(userData) : null;
      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
    }
  }, []);

  const token = localStorage.getItem("userToken") || '';

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    location: '',
    contactMethod: 'email',
    eventDetails: '',
    guests: '',
    eventDate: '',
    eventTime: '',
    dishes: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        city: user.city || '',
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/api/bookings`, {
        chefId,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.mobile,
        contactMethod: formData.contactMethod,
        city: formData.city,
        location: formData.location,
        eventDetails: formData.eventDetails,
        numberOfGuests: formData.guests,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        selectedDishes: formData.dishes.split(',').map(d => d.trim()),
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong while booking.");
    } finally {
      setLoading(false);
    }
  };

  const convertTo12Hour = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  if (submitted) {
    return <p className="booking-success">Booking submitted! Awaiting chef confirmation.</p>;
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Book Chef</h3>
      <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
      <select name="contactMethod" value={formData.contactMethod} onChange={handleChange}>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="whatsapp">WhatsApp</option>
      </select>
      <textarea name="eventDetails" placeholder="Event Details" value={formData.eventDetails} onChange={handleChange} required />
      <input type="number" name="guests" placeholder="Number of Guests" value={formData.guests} onChange={handleChange} required />
      <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
      
      <input
        type="time"
        name="eventTime"
        value={formData.eventTime}
        onChange={handleChange}
        required
      />
      {formData.eventTime && (
        <p style={{ fontSize: '14px', color: '#555' }}>
          Selected Time: <strong>{convertTo12Hour(formData.eventTime)}</strong>
        </p>
      )}

      <input type="text" name="dishes" placeholder="Select Dishes (comma separated)" value={formData.dishes} onChange={handleChange} required />

      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Submit Booking'}
      </button>
    </form>
  );
};

export default BookingForm;


// import React, { useState, useEffect } from 'react';
// import '../styles/bookingForm.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const BookingForm = ({ chefId }) => {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [bookedDates, setBookedDates] = useState([]);
//   const [dateError, setDateError] = useState('');

//   useEffect(() => {
//     try {
//       const userData = localStorage.getItem("user");
//       const parsedUser = userData && userData !== "undefined" ? JSON.parse(userData) : null;
//       setUser(parsedUser);
//     } catch (error) {
//       console.error("Invalid user data in localStorage:", error);
//     }
//   }, []);

//   const token = localStorage.getItem("userToken") || '';

//   const [formData, setFormData] = useState({
//     name: '',
//     mobile: '',
//     email: '',
//     city: '',
//     location: '',
//     contactMethod: 'email',
//     eventDetails: '',
//     guests: '',
//     eventDate: '',
//     eventTime: '',
//     dishes: '',
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData((prev) => ({
//         ...prev,
//         name: user.name || '',
//         email: user.email || '',
//         city: user.city || '',
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!chefId) return;

//     axios.get(`/api/bookings/chef/${chefId}/booked-dates`)
//       .then(res => {
//         const convertedDates = res.data.map(dateStr => new Date(dateStr));
//         setBookedDates(convertedDates);
//       })
//       .catch(err => {
//         console.error("Error fetching booked dates:", err);
//       });
//   }, [chefId]);

//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) {
//       alert("Please login first");
//       navigate('/login');
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(`/api/bookings`, {
//         chefId,
//         userName: formData.name,
//         userEmail: formData.email,
//         userPhone: formData.mobile,
//         contactMethod: formData.contactMethod,
//         city: formData.city,
//         location: formData.location,
//         eventDetails: formData.eventDetails,
//         numberOfGuests: formData.guests,
//         eventDate: formData.eventDate,
//         eventTime: formData.eventTime,
//         selectedDishes: formData.dishes.split(',').map(d => d.trim()),
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setSubmitted(true);
//     } catch (err) {
//       console.error("Booking error:", err);
//       alert("Something went wrong while booking.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const convertTo12Hour = (timeStr) => {
//     const [hour, minute] = timeStr.split(':');
//     const hourNum = parseInt(hour);
//     const ampm = hourNum >= 12 ? 'PM' : 'AM';
//     const hour12 = hourNum % 12 || 12;
//     return `${hour12}:${minute} ${ampm}`;
//   };

//   if (submitted) {
//     return <p className="booking-success">Booking submitted! Awaiting chef confirmation.</p>;
//   }

//   return (
//     <form className="booking-form" onSubmit={handleSubmit}>
//       <h3>Book Chef</h3>
//       <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
//       <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
//       <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
//       <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
//       <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
//       <select name="contactMethod" value={formData.contactMethod} onChange={handleChange}>
//         <option value="email">Email</option>
//         <option value="phone">Phone</option>
//         <option value="whatsapp">WhatsApp</option>
//       </select>
//       <textarea name="eventDetails" placeholder="Event Details" value={formData.eventDetails} onChange={handleChange} required />
//       <input type="number" name="guests" placeholder="Number of Guests" value={formData.guests} onChange={handleChange} required />

//       {/* 👉 Updated Date Picker with disabled booked dates */}
//       <label>Select Event Date</label>
//       <DatePicker
//         selected={formData.eventDate ? new Date(formData.eventDate) : null}
//         onChange={(date) => {
//           const formatted = date.toISOString().split('T')[0];
//           const isBooked = bookedDates.some(
//             d => d.toISOString().split('T')[0] === formatted
//           );
//           if (isBooked) {
//             setDateError("This date is already booked for the chef.");
//             setFormData({ ...formData, eventDate: '' });
//           } else {
//             setDateError('');
//             setFormData({ ...formData, eventDate: formatted });
//           }
//         }}
//         minDate={new Date()}
//         highlightDates={[
//           {
//             "react-datepicker__day--highlighted-custom-1": bookedDates,
//           },
//         ]}
//         dayClassName={(date) => {
//           const formatted = date.toISOString().split('T')[0];
//           const isBooked = bookedDates.some(
//             d => d.toISOString().split('T')[0] === formatted
//           );
//           return isBooked ? "highlight-booked-date" : undefined;
//         }}
//         placeholderText="Select event date"
//         dateFormat="yyyy-MM-dd"
//       />
//       {dateError && <p className="error">{dateError}</p>}

//       <input
//         type="time"
//         name="eventTime"
//         value={formData.eventTime}
//         onChange={handleChange}
//         required
//       />
//       {formData.eventTime && (
//         <p style={{ fontSize: '14px', color: '#555' }}>
//           Selected Time: <strong>{convertTo12Hour(formData.eventTime)}</strong>
//         </p>
//       )}

//       <input type="text" name="dishes" placeholder="Select Dishes (comma separated)" value={formData.dishes} onChange={handleChange} required />

//       <button type="submit" disabled={loading}>
//         {loading ? 'Booking...' : 'Submit Booking'}
//       </button>
//     </form>
//   );
// };

// export default BookingForm;

