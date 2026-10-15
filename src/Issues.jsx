import { useEffect, useState } from 'react';

const API_URL = 'https://library-management-system-3-0okb.onrender.com';

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    bookId: '',
    studentId: '',
    returnDate: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      setLoading(true);

      const [issuesRes, booksRes, studentsRes] = await Promise.all([
        fetch(`${API_URL}/api/issues`),
        fetch(`${API_URL}/api/books`),
        fetch(`${API_URL}/api/students`),
      ]);

      if (!issuesRes.ok || !booksRes.ok || !studentsRes.ok) {
        throw new Error('Unable to load library records.');
      }

      const [issuesData, booksData, studentsData] = await Promise.all([
        issuesRes.json(),
        booksRes.json(),
        studentsRes.json(),
      ]);

      setIssues(Array.isArray(issuesData) ? issuesData : []);
      setBooks(Array.isArray(booksData) ? booksData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleIssue(event) {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: Number(form.bookId),
          studentId: Number(form.studentId),
          returnDate: form.returnDate,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Unable to issue book (${response.status}).`
        );
      }

      setMessage('Book issued successfully!');
      setForm({
        bookId: '',
        studentId: '',
        returnDate: '',
      });

      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReturn(issueId) {
    if (!window.confirm('Confirm that this book is being returned?')) {
      return;
    }

    setMessage('');

    try {
      const response = await fetch(
        `${API_URL}/api/issues/return/${issueId}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Unable to return book (${response.status}).`
        );
      }

      setMessage('Book returned successfully!');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function getBookTitle(bookId) {
    const book = books.find(
      (item) => Number(item.id) === Number(bookId)
    );

    return book ? book.title : `Book ID: ${bookId}`;
  }

  function getStudentName(studentId) {
    const student = students.find(
      (item) => Number(item.id) === Number(studentId)
    );

    return student
      ? student.name ?? student.studentName ?? `Student ID: ${studentId}`
      : `Student ID: ${studentId}`;
  }

  return (
    <div style={styles.page}>
      <h1>Issue & Return Management</h1>
      <p>Issue books to students and record their returns.</p>

      {message && (
        <p role="status" style={styles.message}>
          {message}
        </p>
      )}

      <form onSubmit={handleIssue} style={styles.form}>
        <h2>Issue a Book</h2>

        <label htmlFor="bookId">Select Book</label>
        <select
          id="bookId"
          name="bookId"
          value={form.bookId}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Choose a book</option>

          {books
            .filter((book) => book.quantity > 0)
            .map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} — Available: {book.quantity}
              </option>
            ))}
        </select>

        <label htmlFor="studentId">Select Student</label>
        <select
          id="studentId"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Choose a student</option>

          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name ?? student.studentName ?? `Student ${student.id}`}
            </option>
          ))}
        </select>

        <label htmlFor="returnDate">Due Date</label>
        <input
          id="returnDate"
          type="date"
          name="returnDate"
          value={form.returnDate}
          onChange={handleChange}
          min={new Date().toLocaleDateString('en-CA')}
          required
          style={styles.input}
        />

        <button
          type="submit"
          disabled={submitting}
          style={styles.button}
        >
          {submitting ? 'Issuing...' : 'Issue Book'}
        </button>
      </form>

      <h2>Issue Records</h2>

      {loading ? (
        <p>Loading records...</p>
      ) : issues.length === 0 ? (
        <p>No issue records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>Issue ID</th>
                <th style={styles.cell}>Book</th>
                <th style={styles.cell}>Student</th>
                <th style={styles.cell}>Issue Date</th>
                <th style={styles.cell}>Due Date</th>
                <th style={styles.cell}>Status</th>
                <th style={styles.cell}>Action</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue) => {
                const isReturned = issue.actualReturnDate != null;

                return (
                  <tr key={issue.id}>
                    <td style={styles.cell}>{issue.id}</td>
                    <td style={styles.cell}>
                      {getBookTitle(issue.bookId)}
                    </td>
                    <td style={styles.cell}>
                      {getStudentName(issue.studentId)}
                    </td>
                    <td style={styles.cell}>
                      {issue.issueDate ?? '—'}
                    </td>
                    <td style={styles.cell}>
                      {issue.returnDate ?? '—'}
                    </td>
                    <td style={styles.cell}>
                      {isReturned
                        ? `Returned (${issue.actualReturnDate})`
                        : 'Issued'}
                    </td>
                    <td style={styles.cell}>
                      {!isReturned && (
                        <button
                          onClick={() => handleReturn(issue.id)}
                          style={styles.returnButton}
                        >
                          Return Book
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    color: '#243047',
  },
  form: {
    maxWidth: '450px',
    display: 'grid',
    gap: '12px',
    padding: '20px',
    marginBottom: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    padding: '12px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  returnButton: {
    padding: '8px 12px',
    cursor: 'pointer',
  },
  message: {
    padding: '12px',
    background: '#eef6ff',
    borderRadius: '6px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  cell: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
};