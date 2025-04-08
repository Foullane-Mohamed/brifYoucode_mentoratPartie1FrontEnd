import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService, categoryService, statsService } from '../services/api';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import CourseCard from '../components/courses/CourseCard';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données pour la page d'accueil
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Charger tous les cours et prendre les 3 premiers pour la section "Featured"
        const coursesResponse = await courseService.getAll();
        setFeaturedCourses(coursesResponse.data.slice(0, 3));
        
        // Charger toutes les catégories
        const categoriesResponse = await categoryService.getAll();
        setCategories(categoriesResponse.data);
        
        // Charger les statistiques des cours
        const statsResponse = await statsService.getCourseStats();
        setStats(statsResponse.data);
        
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  if (loading) {
    return <Loader text="Chargement de la page d'accueil..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }

  return (
  
    <div className="bg-gray-50 min-h-screen pt-20">
    
      {/* Hero section with gradient and pattern */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-800 to-purple-700 text-white py-16 mb-16">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Bienvenue sur <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-pink-200">Mentora</span>
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Développez vos compétences avec nos cours de qualité dans divers domaines technologiques
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/courses"
                className="bg-white text-indigo-800 font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 focus:outline-none"
              >
                Parcourir les cours
              </Link>
              <Link
                to="/stats"
                className="bg-indigo-600 border border-indigo-400 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-indigo-500 transition transform hover:-translate-y-1 focus:ring-2 focus:ring-white focus:outline-none"
              >
                Voir les statistiques
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f9fafb" fillOpacity="1" d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,101.3C840,85,960,75,1080,90.7C1200,107,1320,149,1380,170.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* Featured courses section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <span className="inline-block w-2 h-8 bg-indigo-600 mr-3 rounded"></span>
              Cours vedettes
            </h2>
            <Link to="/courses" className="text-indigo-600 hover:text-indigo-800 font-medium group flex items-center">
              Voir tous les cours 
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <p className="text-lg text-gray-600">
                Aucun cours disponible pour le moment.
              </p>
            </div>
          )}
        </section>

        {/* Categories section with card hover effects */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <span className="inline-block w-2 h-8 bg-purple-600 mr-3 rounded"></span>
              Catégories
            </h2>
            <Link to="/categories" className="text-purple-600 hover:text-purple-800 font-medium group flex items-center">
              Voir toutes les catégories
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/courses?category=${encodeURIComponent(category.name)}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition text-center transform hover:-translate-y-1 hover:border-purple-200 group"
                >
                  <h3 className="font-medium text-gray-800 group-hover:text-purple-700">{category.name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <p className="text-lg text-gray-600">
                Aucune catégorie disponible pour le moment.
              </p>
            </div>
          )}
        </section>

        {/* Stats preview section with improved cards */}
        {stats && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <span className="inline-block w-2 h-8 bg-cyan-600 mr-3 rounded"></span>
              Aperçu des statistiques
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm p-6 text-center border border-indigo-100 transition hover:shadow-md">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <p className="text-gray-600 mb-2 font-medium">Total des cours</p>
                <p className="text-4xl font-bold text-indigo-700">{stats.total_courses}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm p-6 text-center border border-purple-100 transition hover:shadow-md">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-gray-600 mb-2 font-medium">Prix moyen</p>
                <p className="text-4xl font-bold text-purple-700">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(stats.average_price)}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-white rounded-xl shadow-sm p-6 text-center border border-cyan-100 transition hover:shadow-md">
                <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                </div>
                <p className="text-gray-600 mb-2 font-medium">Catégorie la plus populaire</p>
                <p className="text-4xl font-bold text-cyan-700">
                  {stats.most_popular_category?.name || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to="/stats" 
                className="inline-flex items-center text-cyan-600 hover:text-cyan-800 font-medium group"
              >
                Voir plus de statistiques 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </section>
        )}

        {/* Call to action with more compelling design */}
        <section className="relative overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-xl shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="relative z-10 p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer l'apprentissage ?</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto text-indigo-100">
              Explorez notre catalogue complet de cours et développez vos compétences dès aujourd'hui.
            </p>
            <Link
              to="/courses"
              className="bg-white text-indigo-800 font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 inline-block focus:ring-2 focus:ring-white focus:outline-none"
            >
              Parcourir les cours
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;