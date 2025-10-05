import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const AdminReviewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses'); // GET all courses
        // Add frontend state for loading each action
        const coursesWithState = res.data.courses.map(c => ({
          ...c,
          actionLoading: false
        }));
        setCourses(coursesWithState);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAction = async (courseId, action) => {
    // Set loading for this course
    setCourses(prev =>
      prev.map(c =>
        c._id === courseId ? { ...c, actionLoading: true } : c
      )
    );

    try {
      await axios.post(`/admin/courses/${courseId}/${action}`); // approve/reject

      setCourses(prev =>
        prev.map(c =>
          c._id === courseId
            ? {
                ...c,
                isPublished: action === 'approve' ? true : false,
                actionLoading: false
              }
            : c
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
      // Reset loading if failed
      setCourses(prev =>
        prev.map(c =>
          c._id === courseId ? { ...c, actionLoading: false } : c
        )
      );
    }
  };

  if (loading) return <div className="container mt-5">Loading courses...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h1>All Courses</h1>
      {courses.length === 0 && <p>No courses available.</p>}
      <div className="list-group">
        {courses.map(course => {
          const status = course.isPublished === null 
            ? 'Pending' 
            : course.isPublished 
              ? 'Approved' 
              : 'Rejected';

          return (
            <div
              key={course._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{course.title}</h5>
                <p>{course.description}</p>
                <p>Creator: {course.creatorId?.name || 'Unknown'}</p>
                <p>Category: {course.category}</p>
                <p>Lessons: {course.lessonsCount}</p>
                <p>Status: 
                  {status === 'Pending' && <span className="badge bg-warning ms-2">{status}</span>}
                  {status === 'Approved' && <span className="badge bg-success ms-2">{status}</span>}
                  {status === 'Rejected' && <span className="badge bg-danger ms-2">{status}</span>}
                </p>
              </div>
              <div>
                {course.isPublished === null ? (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleAction(course._id, 'approve')}
                      disabled={course.actionLoading}
                    >
                      {course.actionLoading ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleAction(course._id, 'reject')}
                      disabled={course.actionLoading}
                    >
                      {course.actionLoading ? 'Processing...' : 'Reject'}
                    </button>
                  </>
                ) : (
                  // Buttons hidden if approved or rejected
                  <span></span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReviewCourses;
