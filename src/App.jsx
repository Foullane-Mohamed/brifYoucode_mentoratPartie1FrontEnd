import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importation des pages
import Home from './pages/Home';
import Courses from './pages/Courses.jsx';
import CourseDetail from './pages/CourseDetail';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import Stats from './pages/Stats';

// Importation des composants communs
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        </main>
        <Footer />
        
        {/* Container pour les notifications toast */}
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;