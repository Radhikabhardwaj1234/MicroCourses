import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const LearnLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`/lessons/${lessonId}`); // GET /api/lessons/:lessonId
        setLesson(res.data.lesson);
        setCompleted(res.data.completed); // backend returns if user completed this lesson
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleComplete = async () => {
    try {
      await axios.post(`/lessons/${lessonId}/complete`); // POST /api/lessons/:lessonId/complete
      setCompleted(true);
      alert('Lesson marked as complete!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark complete');
    }
  };

  if (loading) return <div className="container mt-5">Loading lesson...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!lesson) return null;

  return (
    <div className="container mt-5">
      <h1>{lesson.title}</h1>
      <p>{lesson.content}</p>

      {lesson.videoUrl && (
        <div className="mb-3">
          <video width="100%" controls>
            <source src={lesson.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {!completed ? (
        <button className="btn btn-success" onClick={handleComplete}>
          Mark as Complete
        </button>
      ) : (
        <div className="alert alert-info">You have completed this lesson.</div>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Back to Course
      </button>
    </div>
  );
};

export default LearnLesson;
