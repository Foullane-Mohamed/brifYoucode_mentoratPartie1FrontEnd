import React, { useState } from 'react';
import TagCard from './TagCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const TagList = ({ 
  tags, 
  courseCounts = {}, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onRetry 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer les tags en fonction du terme de recherche
  const filteredTags = tags
    ? tags.filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tag.description && 
          tag.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
  
  // Gestionnaire pour la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Afficher le loader pendant le chargement
  if (loading) return <Loader text="Chargement des tags..." />;
  
  // Afficher le message d'erreur en cas d'échec
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  
  // Afficher un message si aucun tag n'est disponible
  if (!tags || tags.length === 0) {
    return <div className="text-center py-8">Aucun tag disponible pour le moment.</div>;
  }
  
  return (
    <div>
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un tag..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {/* Résultats de la recherche */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredTags.length} 
          {filteredTags.length > 1 ? ' tags trouvés' : ' tag trouvé'}
        </p>
      </div>
      
      {/* Liste des tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTags.map(tag => (
          <TagCard 
            key={tag.id} 
            tag={tag}
            courseCount={courseCounts[tag.id] || 0}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TagList;