import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Participants from './pages/Participants';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          {/* Protected Routes (Any logged-in user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-events" element={<MyEvents />} />
          </Route>

          {/* Protected Routes (Admin only) */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path="/admin/events/edit/:id" element={<EditEvent />} />
            <Route path="/admin/events/:id/participants" element={<Participants />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
