import React, { useState } from 'react';
import CategoryCard from './CategoryCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const CategoryList = ({ 
  categories, 
  courseCounts = {}, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onRetry 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer les catégories en fonction du terme de recherche
  const filteredCategories = categories
    ? categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && 
          category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
  
  // Gestionnaire pour la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Afficher le loader pendant le chargement
  if (loading) return <Loader text="Chargement des catégories..." />;
  
  // Afficher le message d'erreur en cas d'échec
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  
  // Afficher un message si aucune catégorie n'est disponible
  if (!categories || categories.length === 0) {
    return <div className="text-center py-8">Aucune catégorie disponible pour le moment.</div>;
  }
  
  return (
    <div>
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {/* Résultats de la recherche */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredCategories.length} 
          {filteredCategories.length > 1 ? ' catégories trouvées' : ' catégorie trouvée'}
        </p>
      </div>
      
      {/* Liste des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category}
            courseCount={courseCounts[category.id] || 0}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;