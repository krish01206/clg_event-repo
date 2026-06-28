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
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Protected Routes (Any logged-in user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Routes (Admin only) */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path="/admin/events/edit/:id" element={<EditEvent />} />
            <Route path="/admin/events/:id/participants" element={<Participants />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
