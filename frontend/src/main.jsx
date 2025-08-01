import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from 'react'; // Add this line to resolve the error

createRoot(document.getElementById('root')).render(
 
    <App />
);
