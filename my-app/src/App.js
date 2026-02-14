import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserForm from './UserForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <UserForm />
      <ToastContainer />
    </div>
  );
}

export default App;
