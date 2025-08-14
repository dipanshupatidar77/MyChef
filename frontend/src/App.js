import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar'; //  this works fine
import ChefProfilePage from './chef/ChefProfilePage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookChef from './pages/BookChef';
import Contact from './pages/Contact';
import About from './pages/About';
import ChefProfile from './pages/ChefProfile';
import MyBookings from './pages/MyBookings';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminPayments from 'admin/AdminPayments';
import AdminRoute from './admin/AdminRoute';
import ChefDashboard from './chef/ChefDashboard';
import PendingBookings from './chef/PendingBookings';
import UpcomingBookings from './chef/UpcomingBookings';
import UserProfilePage from './user/UserProfilePage';
import AdminFeedbacks from './admin/AdminFeedbacks'; 
import BecomeChef from 'chef/BecomeChef';
import ChefCompletedBookings from 'chef/CompletedBookings';
//  ADDED: BookingPage import
import BookingPage from './pages/BookingPage';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* User site routes with Navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <div className="container mt-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/book-chef" element={<BookChef />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/chef/:id" element={<ChefProfile />} />
                  <Route path="/user/dashboard" element={<h2>Coming Soon</h2>} />

                  {/* ❌ OLD route removed: <Route path="/book-chef/:chefId" element={<BookChef />} /> */}
                  
                  {/*  NEW: BookingPage route added */}
                  <Route path="/book-chef/booking/:chefId" element={<BookingPage />} />
                  <Route path="/chef/dashboard" element={<ChefDashboard />} />
                  <Route path="/chef/bookings/pending" element={<PendingBookings />} />
                  <Route path="/chef/bookings/upcoming" element={<UpcomingBookings />} />
                  <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
                  <Route path="/my-bookings" element={<MyBookings />} />
                   <Route path="/chef/profile" element={<ChefProfilePage />} />
                   <Route path="/user/profile" element={<UserProfilePage />} />
                   <Route path="/admin/payments" element={<AdminPayments />} />
                   <Route path="/become-chef" element={<BecomeChef />} />
                    <Route path="/chef/completed-bookings" element={<ChefCompletedBookings />} />

                </Routes>
              </div>
            </>
          }
        />

        {/* Admin routes without Navbar */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
