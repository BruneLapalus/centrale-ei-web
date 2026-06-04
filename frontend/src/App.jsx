import React from 'react';
import { Route, Routes } from 'react-router-dom'; // On enlève BrowserRouter d'ici
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import MovieDetail from './pages/MovieDetail/MovieDetail';

import About from './pages/About/About';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/users-space" element={<Users />} />
      </Routes>
    </Layout>
  );
}

export default App;
