// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // ✅ added useNavigate
// import './ChefCard.css'; // optional: if you want card-specific styles

// const ChefCard = ({ chef }) => {
//   const navigate = useNavigate(); // ✅ added

//   const handleBookNow = () => {
//     navigate(`/book-chef/${chef._id}`); // ✅ redirects to booking page
//   };

//   return (
//     <div className="chef-card">
//       <img src={chef.profilePicUrl} alt={chef.name} className="chef-image" />
//       <div className="chef-details">
//         <h3>{chef.name}</h3>
//         <p>Experience: {chef.experience} years</p>
//         <p>City: {chef.city}</p>

//         {/* ✅ Removed disabled button */}
//         <Link to={`/chef/${chef._id}`}>
//           <button className="view-profile-btn">View Profile</button>
//         </Link>

//         {/* ✅ Added Book Now button below */}
//         <button onClick={handleBookNow} className="book-now-btn">
//           Book Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChefCard;
