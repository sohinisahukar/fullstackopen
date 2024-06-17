import { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { LOGIN, GET_USER_FAVORITE_GENRE, GET_ALL_BOOKS } from '../graphql/queries';

// eslint-disable-next-line react/prop-types
const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const client = useApolloClient();

  const [login, { error }] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token);
      await client.resetStore();
      await client.refetchQueries({
        include: [GET_USER_FAVORITE_GENRE, GET_ALL_BOOKS]
      });
    },
    onError: (err) => {
      console.error('Login error:', err);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ variables: { username, password } });
    } catch (err) {
      console.error('Error submitting login:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>Login failed. Please try again.</p>}
    </form>
  );
};

export default Login;
