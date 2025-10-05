import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

const CourseManage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/creator/courses/${courseId}`);
        setCourse(res.data.course);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/creator/courses/${courseId}/lessons`, {
        title: lessonTitle,
        content: lessonContent,
      });
      setCourse((prev) => ({
        ...prev,
        lessons: [...prev.lessons, res.data.lesson],
      }));
      setLessonTitle('');
      setLessonContent('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add lesson');
    }
  };

  if (loading) return <div className="container mt-5">Loading course...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!course) return null;

  return (
    <div className="container mt-5">
      <h1>Manage Course: {course.title}</h1>
      <p>{course.description}</p>

      <h3>Add New Lesson</h3>
      <form onSubmit={handleAddLesson}>
        <div className="mb-3">
          <label className="form-label">Lesson Title</label>
          <input
            type="text"
            className="form-control"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Lesson Content</label>
          <textarea
            className="form-control"
            value={lessonContent}
            onChange={(e) => setLessonContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success mb-3">
          Add Lesson
        </button>
      </form>

      <h3>Lessons</h3>
      {course.lessons.length === 0 ? (
        <p>No lessons added yet.</p>
      ) : (
        <ul className="list-group">
          {course.lessons.map((lesson) => (
            <li key={lesson._id} className="list-group-item">
              {lesson.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseManage;
