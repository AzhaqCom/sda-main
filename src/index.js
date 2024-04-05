import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './components/header/header';
import { HashRouter } from "react-router-dom"
import MyRoute from './route';
import Footer from './components/footer/footer';

const App = () => {
  return (
    <HashRouter>
      <Header />
      <MyRoute />
      <Footer />
    </HashRouter>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();