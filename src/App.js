import React from 'react';
import Button from './buttonComponent';
import logo from './logo.svg';
import './App.css';

function handleClick(){
  alert('Hello from React!');
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <br></br>
        <Button class="button" label="Click Me" handleClick={handleClick}></Button>
      </header>
    </div>
  );
}

export default App;
