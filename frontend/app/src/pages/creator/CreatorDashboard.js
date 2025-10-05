import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import CourseLessons from './CourseLessons';


const CreatorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);


  // Fetch creator's courses from backend
  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses');
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle create course submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!title || !description) {
      setMessage('Please provide both title and description.');
      return;
    }

    try {
      const res = await axios.post('/creators/courses', { title, description });

      if (res.data && res.data.course) {
        // Add the new course to the local list
        setCourses((prev) => [res.data.course, ...prev]);
        setMessage('Course created successfully! Pending admin approval.');
        setTitle('');
        setDescription('');
        setShowCreateForm(false);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to create course.');
    }
  };

  // Navigate to lessons management page
  const handleViewLessons = (courseId) => {
    window.location.href = `/creator/courses/${courseId}/lessons`;
  };

  return (
    <div className="container mt-5">
      <h1>Creator Dashboard</h1>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Button to show/hide create course form */}
      <div className="mb-3">
        <button
          className="btn btn-success"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Course'}
        </button>
      </div>

      {/* Create Course Form */}
      {showCreateForm && (
        <div className="card mb-4 p-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Course Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
                required
              />
            </div>
            <div className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter course description"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Course</button>
          </form>
        </div>
      )}

      {/* List of Creator's Courses */}
      <div className="card p-3">
        <h3>Your Courses</h3>
        {courses.length === 0 && <p>No courses yet.</p>}
        <ul className="list-group">
          {courses.map((course) => (
            <li
              key={course._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{course.title}</strong> - {course.description} <br />
                Status:{' '}
<span className={
    course.isPublished === null ? 'text-warning' :
    course.isPublished === true ? 'text-success' :
    'text-danger'
}>
    {course.isPublished === null ? 'Pending' :
     course.isPublished === true ? 'Approved' :
     'Rejected'}
</span>
              </div>
              {selectedCourseId === course._id && (
  <CourseLessons courseId={course._id} />
)}
              <button
  className="btn btn-secondary"
  onClick={() =>
    setSelectedCourseId(selectedCourseId === course._id ? null : course._id)
  }
>
  {selectedCourseId === course._id ? 'Hide Lessons' : 'Add/View Lessons'}
</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreatorDashboard;
