import React from 'react';
import { Routes, Route } from 'react-router-dom'; // On enlève BrowserRouter d'ici
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import MovieDetail from './pages/MovieDetail/MovieDetail';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
