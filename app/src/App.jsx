import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Library from './pages/Library';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <div className="app-shell">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <NavBar />
      </div>
    </ThemeProvider>
  );
}
