import { useEffect, useState } from 'react';

const API_URL = 'https://library-management-system-3-0okb.onrender.com/api/books';

const emptyBook = {
  title: '',
  author: '',
  isbn: '',
  price: '',
  quantity: '',
};

function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadBooks() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Could not load books.');
      }

      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.isbn.trim() ||
      form.price === '' ||
      form.quantity === ''
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Price must be a valid non-negative number.');
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError('Quantity must be a whole number greater than or equal to zero.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      price,
      quantity,
    };

    try {
      setSaving(true);

      const response = await fetch(
        editingId === null ? API_URL : `${API_URL}/${editingId}`,
        {
          method: editingId === null ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || 'Unable to save the book.');
      }

      setMessage(editingId === null
        ? 'Book added successfully!'
        : 'Book updated successfully!');

      setForm(emptyBook);
      setEditingId(null);
      await loadBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(book) {
    setEditingId(book.id);

    setForm({
      title: book.title ?? '',
      author: book.author ?? '',
      isbn: book.isbn ?? '',
      price: String(book.price ?? ''),
      quantity: String(book.quantity ?? ''),
    });

    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async function handleDelete(book) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    );

    if (!confirmed) return;

    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/${book.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unable to delete this book.');
      }

      setMessage('Book deleted successfully!');
      await loadBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyBook);
    setMessage('');
    setError('');
  }

  return (
    <div style={styles.page}>
      <h1>📚 Book Management</h1>
      <p>Manage your library collection.</p>

      {message && (
        <div style={styles.success} role="status">
          {message}
        </div>
      )}

      {error && (
        <div style={styles.error} role="alert">
          {error}
        </div>
      )}

      <section style={styles.card}>
        <h2>{editingId === null ? 'Add a New Book' : 'Edit Book'}</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Book Title
              <input
                style={styles.input}
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </label>

            <label style={styles.label}>
              Author
              <input
                style={styles.input}
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </label>

            <label style={styles.label}>
              ISBN
              <input
                style={styles.input}
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
                required
              />
            </label>

            <label style={styles.label}>
              Price
              <input
                style={styles.input}
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </label>

            <label style={styles.label}>
              Quantity
              <input
                style={styles.input}
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
              />
            </label>
          </div>

          <button style={styles.primaryButton} disabled={saving}>
            {saving
              ? 'Saving...'
              : editingId === null
                ? 'Add Book'
                : 'Update Book'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section style={styles.card}>
        <h2>All Books ({books.length})</h2>

        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books found. Add your first book above.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>ISBN</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td style={styles.td}>{book.id}</td>
                    <td style={styles.td}>{book.title}</td>
                    <td style={styles.td}>{book.author}</td>
                    <td style={styles.td}>{book.isbn}</td>
                    <td style={styles.td}>
                      ₹{Number(book.price).toFixed(2)}
                    </td>
                    <td style={styles.td}>{book.quantity}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(book)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button style={styles.secondaryButton} onClick={loadBooks}>
          Refresh Books
        </button>
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    color: '#253047',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    background: '#ffffff',
    padding: '24px',
    marginTop: '24px',
    borderRadius: '12px',
    boxShadow: '0 3px 14px rgba(0,0,0,0.07)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px',
    border: '1px solid #d6dce5',
    borderRadius: '7px',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
  },
  primaryButton: {
    background: '#6558d3',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '7px',
    marginTop: '18px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  secondaryButton: {
    background: '#e9edf5',
    color: '#253047',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '7px',
    marginTop: '16px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  editButton: {
    background: '#e3efff',
    color: '#1559a6',
    border: 'none',
    borderRadius: '5px',
    padding: '7px 10px',
    marginRight: '6px',
    cursor: 'pointer',
  },
  deleteButton: {
    background: '#ffe6e6',
    color: '#b42318',
    border: 'none',
    borderRadius: '5px',
    padding: '7px 10px',
    cursor: 'pointer',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
    fontSize: '14px',
  },
  th: {
    background: '#f1f3f9',
    textAlign: 'left',
    padding: '12px',
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottom: '1px solid #e8ebf0',
    padding: '12px',
    verticalAlign: 'top',
  },
  success: {
    background: '#e4f8ec',
    color: '#17663a',
    padding: '12px',
    borderRadius: '7px',
    marginTop: '16px',
  },
  error: {
    background: '#ffe9e9',
    color: '#a32121',
    padding: '12px',
    borderRadius: '7px',
    marginTop: '16px',
  },
};

export default Books;