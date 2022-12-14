import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from "./pages/Register";
import Redirect from "./pages/Redirect";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuthProvider from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
    <Routes>
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/redirect" element={<Redirect/>} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/" element={<Home />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/" element={<PrivateRoute />} />
    </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
