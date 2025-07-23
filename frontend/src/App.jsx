import './App.css';
import React from 'react';
import Sidebar from './components/Sidebar.jsx';
import Feed from './components/Feed.jsx';
import Widgets from './components/Widgets.jsx';

function App() {

  return (
    <>
      <div className="app">
        <Sidebar/>
        <Feed/>
        <Widgets/>
      </div>
    </>
  )
}

export default App
