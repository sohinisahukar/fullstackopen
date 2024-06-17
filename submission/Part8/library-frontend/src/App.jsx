import { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import FavoriteBooks from './components/FavoriteBooks';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'));
  const client = useApolloClient();

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogout = async () => {
    setToken(null);
    localStorage.removeItem('library-user-token');
    await client.resetStore();
  };

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/authors">Authors</Link>
        <Link to="/books">Books</Link>
        {token && (
          <>
            <Link to="/add-book">Add Book</Link>
            <Link to="/favorite-books">Favorite Books</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!token && <Link to="/login">Login</Link>}
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Library</h1>} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={token ? <NewBook /> : <Navigate to="/login" />} />
        <Route path="/favorite-books" element={token ? <FavoriteBooks /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;
