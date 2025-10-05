import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const CourseLessons = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    content: '',
    videoUrl: '',
    order: 1
  });
  const [message, setMessage] = useState('');

  // Fetch lessons for this course
  const fetchLessons = async () => {
    try {
          console.log(courseId)
      const res = await axios.get(`/lessons`,{
        params:{
            courseId:courseId
        }
      });
      setLessons(res.data.lessons || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewLesson({ ...newLesson, [e.target.name]: e.target.value });
  };

  // Handle adding a new lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('/lessons', {
        courseId,
        ...newLesson,
        order: Number(newLesson.order)
      });
      if (res.data && res.data.lesson) {
        setLessons((prev) => [...prev, res.data.lesson]);
        setMessage('Lesson added successfully');
        setNewLesson({ title: '', content: '', videoUrl: '', order: lessons.length + 1 });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to add lesson');
    }
  };

  // Handle deleting a lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await axios.delete(`/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      setMessage('Lesson deleted successfully');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  if (loading) return <div>Loading lessons...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card p-3 mt-3">
      <h4>Lessons</h4>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Add Lesson Button */}
      <div className="mb-3">
        <button
          className="btn btn-success"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Lesson'}
        </button>
      </div>

      {/* Add Lesson Form */}
      {showAddForm && (
        <div className="card p-3 mb-3">
          <form onSubmit={handleAddLesson}>
            <div className="mb-3">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={newLesson.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Content</label>
              <textarea
                name="content"
                className="form-control"
                value={newLesson.content}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label>Video URL</label>
              <input
                type="text"
                name="videoUrl"
                className="form-control"
                value={newLesson.videoUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label>Order</label>
              <input
                type="number"
                name="order"
                className="form-control"
                value={newLesson.order}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Lesson</button>
          </form>
        </div>
      )}

      {/* List of Lessons */}
      {lessons.length === 0 && <p>No lessons added yet.</p>}
      <ul className="list-group">
        {lessons.map((lesson) => (
          <li key={lesson._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{lesson.title}</strong> - Order: {lesson.order} <br />
              {lesson.content && <p>{lesson.content}</p>}
              {lesson.videoUrl && <p>Video: <a href={lesson.videoUrl} target="_blank" rel="noreferrer">{lesson.videoUrl}</a></p>}
            </div>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteLesson(lesson._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseLessons;
