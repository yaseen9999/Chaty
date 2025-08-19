import logo from './logo.svg';
import './App.css';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
        </Routes>
      </div>
       
    </Router>
    
  );
}

export default App;
