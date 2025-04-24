
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Profil from './pages/profil.jsx';
import Users from './utilisateurs/users.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Profil" element={<Profil />} />
        <Route path="/Users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
