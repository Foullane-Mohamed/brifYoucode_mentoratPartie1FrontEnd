import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onEdit, onDelete }) => {
  // Formatage du prix avec 2 décimales et le symbole €
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(course.price);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {course.title}
          </h3>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-light text-white">
            {formattedPrice}
          </span>
        </div>
        
        {course.category && (
          <div className="mb-2">
            <span className="inline-block bg-secondary-light text-secondary-dark rounded-full px-3 py-1 text-xs font-semibold mr-2">
              {course.category.name}
            </span>
          </div>
        )}
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description || 'Aucune description disponible'}
        </p>
        
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap mb-4">
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
        
        <div className="flex justify-between items-center mt-4">
          <Link 
            to={`/courses/${course.id}`}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Voir les détails
          </Link>
          
          <div className="space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(course)} 
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Modifier
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={() => onDelete(course.id)} 
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;