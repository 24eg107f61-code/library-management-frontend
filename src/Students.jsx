import { useEffect, useState } from 'react';

const API_URL =
  'https://library-management-system-3-0okb.onrender.com/api/students';

const emptyStudent = {
  name: '',
  email: '',
  phone: '',
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyStudent);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadStudents() {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Unable to load students.');
      }

      const data = await response.json();
      setStudents(data);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Unable to save student. Check the student fields.');
      }

      setForm(emptyStudent);
      setEditingId(null);
      setMessage(
        editingId
          ? 'Student updated successfully!'
          : 'Student added successfully!'
      );

      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleEdit(student) {
    setEditingId(student.id);

    setForm({
      name: student.name ?? '',
      email: student.email ?? '',
      phone: student.phone ?? '',
    });

    setMessage('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unable to delete student.');
      }

      setMessage('Student deleted successfully!');
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div style={styles.page}>
      <h1>Student Management</h1>
      <p>Register and manage library students.</p>

      {message && <p role="status">{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>

        <input
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {editingId ? 'Update Student' : 'Add Student'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyStudent);
            }}
            style={styles.cancel}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Registered Students</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>ID</th>
                <th style={styles.cell}>Name</th>
                <th style={styles.cell}>Email</th>
                <th style={styles.cell}>Phone</th>
                <th style={styles.cell}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td style={styles.cell}>{student.id}</td>
                  <td style={styles.cell}>{student.name}</td>
                  <td style={styles.cell}>{student.email}</td>
                  <td style={styles.cell}>{student.phone}</td>
                  <td style={styles.cell}>
                    <button onClick={() => handleEdit(student)}>
                      Edit
                    </button>{' '}
                    <button onClick={() => handleDelete(student.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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
  cancel: {
    padding: '10px',
    cursor: 'pointer',
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