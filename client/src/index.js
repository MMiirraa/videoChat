import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './layouts/App';
import { ProviderState } from "./context/index"
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ProviderState>
    <App />
  </ProviderState>
);
