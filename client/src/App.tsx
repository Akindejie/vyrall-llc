import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthSync } from './store/authStore';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Home } from './pages/Home/Home';
import { EventCreationPage } from './pages/Home/EventCreationPage';
import { EventDetailPage } from './pages/Home/EventDetailPage';
import { People } from './pages/People/People';
import { Search } from './pages/Search/Search';

function App() {
  // Sync Firebase auth state with Recoil
  useAuthSync();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/create" element={<EventCreationPage />} />
        <Route path="/home/event/:id" element={<EventDetailPage />} />
        <Route path="/people" element={<People />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
