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
    <div>
      {/* Hero section */}
      <section className="bg-primary text-white rounded-lg p-8 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur Mentora</h1>
          <p className="text-xl mb-6">
            Développez vos compétences avec nos cours de qualité dans divers domaines technologiques
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/courses"
              className="bg-white text-primary font-medium px-6 py-3 rounded-md hover:bg-gray-100 transition"
            >
              Parcourir les cours
            </Link>
            <Link
              to="/stats"
              className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-md hover:bg-white hover:bg-opacity-10 transition"
            >
              Voir les statistiques
            </Link>
          </div>
        </div>
      </section>

      {/* Featured courses section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cours vedettes</h2>
          <Link to="/courses" className="text-primary hover:text-primary-dark font-medium">
            Voir tous les cours →
          </Link>
        </div>
        
        {featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-600">
            Aucun cours disponible pour le moment.
          </p>
        )}
      </section>

      {/* Categories section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Catégories</h2>
          <Link to="/categories" className="text-primary hover:text-primary-dark font-medium">
            Voir toutes les catégories →
          </Link>
        </div>
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={`/courses?category=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition text-center"
              >
                <h3 className="font-medium text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-600">
            Aucune catégorie disponible pour le moment.
          </p>
        )}
      </section>

      {/* Stats preview section */}
      {stats && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Aperçu des statistiques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-2">Total des cours</p>
              <p className="text-3xl font-bold text-primary">{stats.total_courses}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-2">Prix moyen</p>
              <p className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(stats.average_price)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-2">Catégorie la plus populaire</p>
              <p className="text-3xl font-bold text-primary">
                {stats.most_popular_category?.name || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link 
              to="/stats" 
              className="text-primary hover:text-primary-dark font-medium"
            >
              Voir plus de statistiques →
            </Link>
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="bg-secondary-dark text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à commencer l'apprentissage ?</h2>
        <p className="mb-6">
          Explorez notre catalogue complet de cours et développez vos compétences dès aujourd'hui.
        </p>
        <Link
          to="/courses"
          className="bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-primary-dark transition"
        >
          Parcourir les cours
        </Link>
      </section>
    </div>
  );
};

export default Home;