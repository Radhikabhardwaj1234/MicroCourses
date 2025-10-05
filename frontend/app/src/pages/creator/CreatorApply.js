import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const CreatorApply = () => {
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/creator/apply', { bio }); // backend: POST /api/creator/apply
      setSuccess('Application submitted successfully!');
      setBio('');
      // Optionally redirect to dashboard
      navigate('/creator/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Apply to Become a Creator</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Short Bio</label>
          <textarea
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default CreatorApply;
