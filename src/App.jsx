import { useState } from 'react'
import './App.css'
import  Notifications from './Notifications.jsx';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Notifications />
  );
}

export default App