import { useEffect, useState } from 'react';
import './App.css';
import Books from './Books';
import Students from './Students';

const API_URL = 'https://library-management-system-3-0okb.onrender.com';

function App() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    async function fetchLibraryData() {
      try {
        setLoading(true);
        setError('');

        const [booksResponse, studentsResponse, issuesResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/books`),
            fetch(`${API_URL}/api/students`),
            fetch(`${API_URL}/api/issues`),
          ]);

        if (
          !booksResponse.ok ||
          !studentsResponse.ok ||
          !issuesResponse.ok
        ) {
          throw new Error('Unable to retrieve library data from the backend.');
        }

        const [booksData, studentsData, issuesData] = await Promise.all([
          booksResponse.json(),
          studentsResponse.json(),
          issuesResponse.json(),
        ]);

        setBooks(Array.isArray(booksData) ? booksData : []);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setIssues(Array.isArray(issuesData) ? issuesData : []);
      } catch (err) {
        console.error('Library API error:', err);
        setError(
          'Could not load library data. Please check the backend connection.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLibraryData();
  }, []);

  const returnedIssues = issues.filter(
    (issue) => issue.returnDate != null
  ).length;

  const currentlyIssued = issues.filter(
    (issue) => issue.returnDate == null
  ).length;

  // Books Management page
  if (currentPage === 'books') {
    return (
      <div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          style={{
            margin: '20px',
            padding: '10px 16px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '6px',
            background: '#e9edf5',
          }}
        >
          ← Back to Dashboard
        </button>

        <Books />
      </div>
    );
  }

  // Students Management page
  if (currentPage === 'students') {
    return (
      <div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          style={{
            margin: '20px',
            padding: '10px 16px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '6px',
            background: '#e9edf5',
          }}
        >
          ← Back to Dashboard
        </button>

        <Students />
      </div>
    );
  }

  // Dashboard
  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">📚 LibraryHub</h2>

        <nav>
          <a
            href="#dashboard"
            className="active"
            onClick={(event) => {
              event.preventDefault();
              setCurrentPage('dashboard');
            }}
          >
            🏠 Dashboard
          </a>

          <a
            href="#books"
            onClick={(event) => {
              event.preventDefault();
              setCurrentPage('books');
            }}
          >
            📖 Books
          </a>

          <a
            href="#students"
            onClick={(event) => {
              event.preventDefault();
              setCurrentPage('students');
            }}
          >
            👨‍🎓 Students
          </a>

          <a
            href="#issues"
            onClick={(event) => {
              event.preventDefault();
              setCurrentPage('dashboard');
              document
                .getElementById('issues')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            📋 Issue & Return
          </a>
        </nav>

        <div className="sidebar-footer">
          Library Management System
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your Library Management System!</p>
          </div>

          <div className="admin-badge">👤 Administrator</div>
        </header>

        <section className="welcome-banner">
          <div>
            <h2>Manage Your Library Easily</h2>
            <p>
              Organize books, manage students, and track issued books
              in one place.
            </p>
          </div>

          <div className="banner-icon">📚</div>
        </section>

        {loading && <p>Loading library data...</p>}

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">📚</div>
            <p>Total Books</p>
            <h2>{loading ? '...' : books.length}</h2>
            <span>Books in the library</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">🎓</div>
            <p>Total Students</p>
            <h2>{loading ? '...' : students.length}</h2>
            <span>Registered students</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">📤</div>
            <p>Books Issued</p>
            <h2>{loading ? '...' : currentlyIssued}</h2>
            <span>Currently borrowed</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">📥</div>
            <p>Books Returned</p>
            <h2>{loading ? '...' : returnedIssues}</h2>
            <span>Successfully returned</span>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel" id="books">
            <div className="panel-heading">
              <h2>📖 Book Management</h2>
            </div>

            <p>Manage books stored in your library database.</p>
            <p>Total books: {books.length}</p>

            <button onClick={() => setCurrentPage('books')}>
              Manage Books →
            </button>
          </div>

          <div className="panel" id="students">
            <div className="panel-heading">
              <h2>🎓 Student Management</h2>
            </div>

            <p>Manage students stored in your library database.</p>
            <p>Total students: {students.length}</p>

            <button onClick={() => setCurrentPage('students')}>
              Manage Students →
            </button>
          </div>

          <div className="panel" id="issues">
            <div className="panel-heading">
              <h2>📋 Issue & Return</h2>
            </div>

            <p>Track borrowed and returned books.</p>
            <p>Currently issued: {currentlyIssued}</p>

            <button
              onClick={() =>
                alert('Issue & Return Management is our next step!')
              }
            >
              Manage Issues →
            </button>
          </div>
        </section>

        <footer>
          © 2026 LibraryHub · Library Management System
        </footer>
      </main>
    </div>
  );
}

export default App;