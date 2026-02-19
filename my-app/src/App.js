import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UsersProvider } from './UsersContext';
import HomePage from './HomePage';
import UserForm from './UserForm';
import './App.css';

function App() {
  return (
    <UsersProvider>
      <BrowserRouter
        basename={process.env.PUBLIC_URL}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<UserForm />} />
          </Routes>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </UsersProvider>
  );
}

export default App;
