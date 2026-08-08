import Signup from "./pages/Signup"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Menu from "./pages/Menu"

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/register" element={<Signup/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/menu" element={<Menu/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
