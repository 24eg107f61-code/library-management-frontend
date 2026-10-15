import './App.css';

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">📚 LibraryHub</h2>

        <nav>
          <a href="#dashboard" className="active">🏠 Dashboard</a>
          <a href="#books">📖 Books</a>
          <a href="#students">👨‍🎓 Students</a>
          <a href="#issues">📋 Issue & Return</a>
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
            <p>Organize books, manage students, and track issued books in one place.</p>
          </div>
          <div className="banner-icon">📚</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">📚</div>
            <p>Total Books</p>
            <h2>0</h2>
            <span>Books in the library</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">🎓</div>
            <p>Total Students</p>
            <h2>0</h2>
            <span>Registered students</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">📤</div>
            <p>Books Issued</p>
            <h2>0</h2>
            <span>Currently borrowed</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">📥</div>
            <p>Books Returned</p>
            <h2>0</h2>
            <span>Successfully returned</span>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel" id="books">
            <div className="panel-heading">
              <h2>📖 Book Management</h2>
            </div>
            <p>Add, view, update, and delete library books.</p>
            <button onClick={() => alert('Book Management will be connected to the backend soon!')}>
              Manage Books →
            </button>
          </div>

          <div className="panel" id="students">
            <div className="panel-heading">
              <h2>🎓 Student Management</h2>
            </div>
            <p>Maintain student information and registration records.</p>
            <button onClick={() => alert('Student Management will be connected to the backend soon!')}>
              Manage Students →
            </button>
          </div>

          <div className="panel" id="issues">
            <div className="panel-heading">
              <h2>📋 Issue & Return</h2>
            </div>
            <p>Track borrowed books and manage returns.</p>
            <button onClick={() => alert('Issue and Return will be connected to the backend soon!')}>
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