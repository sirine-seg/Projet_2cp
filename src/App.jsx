import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'




import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";





import Users from "./assets/users.jsx";
import Ajout from "./assets/ajouttt";
import Modifie from "./assets/modifier.jsx";




<Routes>
<Route path="/Users" element={<Users />} />
<Route path="/Ajout" element={<Ajout />} />
<Route path="/Modifie/:id" element={<Modifie />} />
</Routes>





function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
