import React, { useState, useEffect } from 'react';
import { statsService } from '../services/api';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Enregistrement des composants ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Stats = () => {
  const [courseStats, setCourseStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [tagStats, setTagStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger toutes les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [coursesResponse, categoriesResponse, tagsResponse] = await Promise.all([
          statsService.getCourseStats(),
          statsService.getCategoryStats(),
          statsService.getTagStats(),
        ]);
        
        setCourseStats(coursesResponse.data);
        setCategoryStats(categoriesResponse.data);
        setTagStats(tagsResponse.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // Préparer les données pour le graphique des catégories
  const getCategoryChartData = () => {
    if (!categoryStats || !categoryStats.categories_by_courses_count) {
      return null;
    }
    
    // Trier par nombre de cours (du plus au moins)
    const sortedCategories = [...categoryStats.categories_by_courses_count]
      .sort((a, b) => b.courses_count - a.courses_count);
    
    return {
      labels: sortedCategories.map(item => item.name),
      datasets: [
        {
          label: 'Nombre de cours',
          data: sortedCategories.map(item => item.courses_count),
          backgroundColor: 'rgba(0, 120, 231, 0.8)',
          borderColor: 'rgba(0, 120, 231, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Préparer les données pour le graphique des tags
  const getTagChartData = () => {
    if (!tagStats || !tagStats.tags_by_courses_count) {
      return null;
    }
    
    // Trier par nombre de cours (du plus au moins) et prendre les 10 premiers
    const sortedTags = [...tagStats.tags_by_courses_count]
      .sort((a, b) => b.courses_count - a.courses_count)
      .slice(0, 10);
    
    return {
      labels: sortedTags.map(item => item.name),
      datasets: [
        {
          label: 'Nombre de cours',
          data: sortedTags.map(item => item.courses_count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
            'rgba(40, 159, 64, 0.8)',
            'rgba(210, 199, 199, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(40, 159, 64, 1)',
            'rgba(210, 199, 199, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Options du graphique à barres
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nombre de cours par catégorie',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
  
  // Options du graphique en camembert
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 des tags les plus utilisés',
      },
    },
  };
  
  // Formatage du prix avec 2 décimales et le symbole €
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };
  
  // Afficher le loader pendant le chargement
  if (loading) {
    return <Loader text="Chargement des statistiques..." />;
  }
  
  // Afficher le message d'erreur en cas d'échec
  if (error) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }
  
  // Afficher un message si aucune statistique n'est disponible
  if (!courseStats && !categoryStats && !tagStats) {
    return <div className="text-center py-8">Aucune statistique disponible pour le moment.</div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mt-20 mb-6">Statistiques</h1>
      
      {/* Statistiques générales */}
      {courseStats && (
        <div className="bg-black rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Général</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Total des cours</p>
              <p className="text-3xl font-bold text-primary">{courseStats.total_courses}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Prix moyen</p>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(courseStats.average_price)}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Catégorie la plus populaire</p>
              <p className="text-3xl font-bold text-primary">
                {courseStats.most_popular_category?.name || 'N/A'}
              </p>
              {courseStats.most_popular_category && (
                <p className="text-sm text-gray-500 mt-1">
                  {courseStats.most_popular_category.courses_count} cours
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Statistiques des catégories */}
      {categoryStats && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Catégories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Total des catégories</p>
              <p className="text-3xl font-bold text-primary">{categoryStats.total_categories}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Catégories avec cours</p>
              <p className="text-3xl font-bold text-primary">{categoryStats.categories_with_courses}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Catégories sans cours</p>
              <p className="text-3xl font-bold text-primary">{categoryStats.categories_without_courses}</p>
            </div>
          </div>
          
          {/* Graphique des catégories */}
          {getCategoryChartData() && (
            <div className="mt-8 h-64">
              <Bar data={getCategoryChartData()} options={barOptions} />
            </div>
          )}
        </div>
      )}
      
      {/* Statistiques des tags */}
      {tagStats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Tags</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Total des tags</p>
              <p className="text-3xl font-bold text-primary">{tagStats.total_tags}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Tags avec cours</p>
              <p className="text-3xl font-bold text-primary">{tagStats.tags_with_courses}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Tags sans cours</p>
              <p className="text-3xl font-bold text-primary">{tagStats.tags_without_courses}</p>
            </div>
          </div>
          
          {/* Graphique des tags */}
          {getTagChartData() && (
            <div className="mt-8 h-64 flex justify-center">
              <div style={{ width: '50%' }}>
                <Pie data={getTagChartData()} options={pieOptions} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Stats;