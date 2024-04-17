import React from 'react';
import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import {Header} from './header';
import {Login} from './login/login';
import {NewUser} from './new-user/new-user';
import {Budget} from './budget/budget';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';


function Footer() {
  return (
    <footer>
        <span>Created by Hyrum Durfee</span>
        <a href="https://github.com/frenchhornbro/startup">GitHub</a>
    </footer>
  );
}

function App() {
    return (
      <div>
        <Header />
        <Budget />
        <Footer />
      </div>
    );
}
        // <BrowserRouter>
        // <div className="app">
        //   <nav>
        //     <NavLink to="/login">Login</NavLink>
        //     <NavLink to="/home">Home</NavLink>
        //     <NavLink to="/budget">Budget</NavLink>
        //     <NavLink to="/about">About</NavLink>
        //   </nav>
  
        //   <main>
        //     <Routes>
        //         //TODO: Create these elements
        //       <Route path="/" element={<Home />} exact />
        //       <Route path="/login" element={<Login />} />
        //       <Route path="/budget" element={<Budget />} />
        //       <Route path="/about" element={<About />} />
        //       <Route path="*" element={<Navigate to="/" replace />} />
        //     </Routes>
        //   </main>
  
        //   <footer>Footer</footer>
        // </div>
        // </BrowserRouter>

export default App;