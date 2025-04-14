import Login from "./Login"
import Register from "./signup"
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>



<Router>
<Routes>
   <Route path="/signup" element={< Register />} />
   <Route path="/login" element={<Login />} />
   

   
</Routes>
</Router>
</>
  )
}

export default App