import { Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Profile from "./components/Profile"
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="profile" element={ <Profile/> } />
      </Routes>
    </div>
  )
}

export default App