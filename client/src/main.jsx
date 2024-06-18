import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './lib/redux/store.js';
import { LoadingProvider } from './context/LoadingContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store()}>
            <LoadingProvider>
                <App />
            </LoadingProvider>
        </Provider>
    </React.StrictMode>
);
