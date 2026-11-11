import React from 'react';
import ReactDOM from 'react-dom/client';
// Design-system tokens first so every component stylesheet can build on them.
import './styles/theme.css';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
