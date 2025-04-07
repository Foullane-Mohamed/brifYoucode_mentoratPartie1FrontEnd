import React from 'react';
import { Link } from 'react-router-dom';

const TagCard = ({ tag, courseCount = 0, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {tag.name}
          </h3>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {courseCount} {courseCount === 1 ? 'cours' : 'cours'}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">
          {tag.description || 'Aucune description disponible'}
        </p>
        
        <div className="flex justify-between items-center mt-4">
          <Link 
            to={`/courses?tag=${encodeURIComponent(tag.name)}`}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Voir les cours
          </Link>
          
          <div className="space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(tag)} 
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Modifier
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={() => onDelete(tag.id)} 
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

export default TagCard;