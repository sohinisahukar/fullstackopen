
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>
);
