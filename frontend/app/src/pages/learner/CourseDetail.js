import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

const CourseDetail = () => {
  const { id } = useParams(); // course ID
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]); // <-- NEW STATE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/courses/${id}`); // backend GET /api/courses/:id
        setCourse(res.data.course);
        setEnrolled(res.data.enrolled); // backend should return if user enrolled
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    const fetchLessons = async () => {
      try {
        const res = await axios.get(`/lessons?courseId=${id}`); // <-- NEW FETCH
        setLessons(res.data.lessons || []);
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
    };

    fetchCourse();
    fetchLessons();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await axios.post(`/enroll/${id}`); // backend POST /api/courses/:id/enroll
      setEnrolled(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) return <div className="container mt-5">Loading course...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!course) return null;

  return (
    <div className="container mt-5">
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      {!enrolled ? (
        <button className="btn btn-success mb-3" onClick={handleEnroll}>
          Enroll
        </button>
      ) : (
        <div className="alert alert-info mb-3">You are enrolled in this course.</div>
      )}

      <h3>Lessons</h3>
      <ul className="list-group">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <li key={lesson._id} className="list-group-item">
              <h1>{lesson.title}</h1>
            </li>
          ))
        ) : (
          <p>No lessons added yet.</p>
        )}
      </ul>
    </div>
  );
};

export default CourseDetail;
