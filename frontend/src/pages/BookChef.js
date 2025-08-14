

import React, { useEffect, useState } from 'react';
import { getAllApprovedChefs, searchChefsByCity } from '../services/chefApi';
import ChefCard from '../components/ChefCard';
import '../styles/BookChef.css';
import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

const BookChef = () => {
  const [chefs, setChefs] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const { chefId } = useParams();

  const fetchAllChefs = async () => {
    try {
      const data = await getAllApprovedChefs();
      console.log("✅ API response:", data);
      //  Filter blocked chefs
      const filtered = Array.isArray(data)
        ? data.filter(chef => !chef.isBlocked)
        : [];
      setChefs(filtered);
    } catch (err) {
      console.error('Error fetching chefs:', err);
    }
  };

  const handleSearch = async () => {
    if (searchCity.trim() === '') {
      fetchAllChefs();
    } else {
      try {
        const data = await searchChefsByCity(searchCity);
        console.log("🔍 Search result:", data);
        const filtered = Array.isArray(data)
          ? data.filter(chef => !chef.isBlocked)
          : [];
        setChefs(filtered);
      } catch (err) {
        console.error('Search error:', err);
        setChefs([]);
      }
    }
  };

  useEffect(() => {
    fetchAllChefs();
  }, []);

  if (chefId) {
    return (
      <div className="book-chef-container">
        <BookingForm chefId={chefId} />
      </div>
    );
  }

  return (
    <div className="book-chef-container">
      <h2 className="book-chef-heading">Find & Book a Chef</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={handleSearch}>🔍 Search</button>
      </div>

      <h3 className="trending-title">All Our Professional Chefs</h3>

      <div className="chef-list">
        {Array.isArray(chefs) && chefs.length > 0 ? (
          chefs.map((chef) => <ChefCard key={chef._id} chef={chef} />)
        ) : (
          <p>No chefs found</p>
        )}
      </div>
    </div>
  );
};

export default BookChef;
