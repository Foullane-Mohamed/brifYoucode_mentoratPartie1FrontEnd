import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseService } from '../services/api';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger les détails du cours
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await courseService.getById(id);
        setCourse(response.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);
  
  // Supprimer le cours
  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      return;
    }
    
    try {
      await courseService.delete(id);
      toast.success('Le cours a été supprimé avec succès');
      // Rediriger vers la liste des cours
      navigate('/courses');
    } catch (err) {
      toast.error('Une erreur est survenue lors de la suppression');
    }
  };
  
  // Afficher le loader pendant le chargement
  if (loading) {
    return <Loader text="Chargement des détails du cours..." />;
  }
  
  // Afficher le message d'erreur en cas d'échec
  if (error) {
    return (
      <div>
        <div className="mb-4">
          <Link to="/courses" className="text-primary hover:text-primary-dark">
            &larr; Retour aux cours
          </Link>
        </div>
        <ErrorMessage 
          error={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }
  
  // Afficher un message si le cours n'existe pas
  if (!course) {
    return (
      <div>
        <div className="mb-4">
          <Link to="/courses" className="text-primary hover:text-primary-dark">
            &larr; Retour aux cours
          </Link>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-700">
            Le cours demandé n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }
  
  // Formatage du prix avec 2 décimales et le symbole €
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(course.price);
  
  return (
    <div>
      {/* Lien de retour */}
      <div className="mb-4">
        <Link to="/courses" className="text-primary hover:text-primary-dark">
          &larr; Retour aux cours
        </Link>
      </div>
      
      {/* En-tête du cours */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">
            {course.title}
          </h1>
          <span className="inline-block px-4 py-2 rounded-md text-lg font-semibold bg-primary-light text-white">
            {formattedPrice}
          </span>
        </div>
        
        <div className="mb-6">
          {course.category && (
            <div className="mb-2">
              <span className="inline-block bg-secondary-light text-secondary-dark rounded-full px-3 py-1 text-sm font-semibold mr-2">
                Catégorie: {course.category.name}
              </span>
            </div>
          )}
          
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap">
              {course.tags.map(tag => (
                <span 
                  key={tag.id} 
                  className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">
            {course.description || 'Aucune description disponible pour ce cours.'}
          </p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Link 
            to={`/courses?edit=${course.id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Modifier
          </Link>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Supprimer
          </button>
        </div>
      </div>
      
      {/* Section des détails supplémentaires */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Informations additionnelles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 mb-1">ID du cours:</p>
            <p className="font-medium">{course.id}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Date de création:</p>
            <p className="font-medium">
              {new Date(course.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Dernière mise à jour:</p>
            <p className="font-medium">
              {new Date(course.updated_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;