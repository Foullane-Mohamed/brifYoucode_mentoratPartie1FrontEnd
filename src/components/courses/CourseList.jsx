import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const CourseList = ({ courses, loading, error, onEdit, onDelete, onRetry }) => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    tags: [],
  });
  
  // Liste des catégories uniques pour le filtre
  const categories = courses 
    ? [...new Set(courses.map(course => course.category?.name))]
        .filter(Boolean)
        .sort()
    : [];
  
  // Liste des tags uniques pour le filtre
  const allTags = courses 
    ? [...new Set(courses.flatMap(course => course.tags?.map(tag => tag.name) || []))]
        .filter(Boolean)
        .sort() 
    : [];
  
  // Appliquer les filtres lorsque les cours ou les filtres changent
  useEffect(() => {
    if (!courses) return;
    
    let result = [...courses];
    
    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchLower) || 
        (course.description && course.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtre par catégorie
    if (filters.category) {
      result = result.filter(course => 
        course.category && course.category.name === filters.category
      );
    }
    
    // Filtre par prix minimum
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      result = result.filter(course => parseFloat(course.price) >= minPrice);
    }
    
    // Filtre par prix maximum
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      result = result.filter(course => parseFloat(course.price) <= maxPrice);
    }
    
    // Filtre par tags
    if (filters.tags.length > 0) {
      result = result.filter(course => 
        course.tags && course.tags.some(tag => filters.tags.includes(tag.name))
      );
    }
    
    setFilteredCourses(result);
  }, [courses, filters]);
  
  // Gestionnaire de changement de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Gestionnaire pour les filtres de tags (multiple)
  const handleTagFilterChange = (tag) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };
  
  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      tags: [],
    });
  };
  
  // Afficher le loader pendant le chargement
  if (loading) return <Loader text="Chargement des cours..." />;
  
  // Afficher le message d'erreur en cas d'échec
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  
  // Afficher un message si aucun cours n'est disponible
  if (!courses || courses.length === 0) {
    return <div className="text-center py-8">Aucun cours disponible pour le moment.</div>;
  }
  
  return (
    <div>
      {/* Section des filtres */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">Filtres</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Recherche par texte */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Rechercher un cours..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          {/* Filtre par catégorie */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Filtres de prix */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Prix min
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Prix max
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Filtres de tags */}
        <div className="mb-4">
          <p className="block text-sm font-medium text-gray-700 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagFilterChange(tag)}
                className={`px-2 py-1 text-xs rounded-full transition ${
                  filters.tags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Bouton de réinitialisation */}
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>
      
      {/* Résultats de la recherche */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredCourses.length} 
          {filteredCourses.length > 1 ? ' cours trouvés' : ' cours trouvé'}
        </p>
      </div>
      
      {/* Liste des cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseList;