import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const Progress = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get('/progress'); // GET /api/progress
        setCourses(res.data.courses || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div className="container mt-5">Loading progress...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h1>My Courses Progress</h1>
      {courses.length === 0 && <p>You are not enrolled in any courses.</p>}

      <div className="row">
        {courses.map((course) => (
          <div className="col-md-6 mb-3" key={course._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p>Progress: {course.progress}%</p>
                <div className="progress mb-2">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${course.progress}%` }}
                    aria-valuenow={course.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                {course.progress === 100 && course.certificate ? (
                  <div className="alert alert-success">
                    Certificate issued: <br />
                    <strong>{course.certificate.serial}</strong>
                  </div>
                ) : (
                  <p>Keep learning to unlock your certificate!</p>
                )}

                <Link to={`/courses/${course._id}`} className="btn btn-primary">
                  Go to Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
