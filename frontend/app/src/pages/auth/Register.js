import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('learner');
  const [adminSecret, setAdminSecret] = useState('supersecurekey123'); // ✅ added
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const body = { name, email, password, role };
      if (role === 'admin') body.adminSecret = adminSecret; // send secret only for admin

      const res = await axios.post('/auth/register', body);
      if (res.data) {
        navigate('/courses'); // redirect after register
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="learner">Learner</option>
            <option value="creator">Creator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {role === 'admin' && (
          <div className="mb-3">
            <label>Admin Secret Key</label>
            <input
              type="password"
              className="form-control"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              disabled
            />
          </div>
        )}

        <button type="submit" className="btn btn-success">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;



