import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './components/Home';
import Profile from './components/Profile';
import './styles/App.css';

function App() {
  const { loggedIn } = useSelector((state) => state.auth);

  return (
    <div data-testid="app">
      <Routes>
        <Route element={loggedIn ? <Profile /> : <Home />} path="/" />
        <Route path="/profile" element={loggedIn ? <Profile /> : <Home />} />
      </Routes>
    </div>
  );
}

export default App;
