import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className='bg-blue-500 text-white p-4 text-center'>
        <h1 className='text-4xl font-bold'>Hello, Tailwind with Vite!</h1>
        <p className='mt-2'>This is styled using Tailwind CSS.</p>
      </div>
    </>
  );
}

export default App;
