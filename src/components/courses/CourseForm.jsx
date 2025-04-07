import React, { useState, useEffect } from 'react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const CourseForm = ({ 
  initialData = {
    title: '',
    description: '',
    price: '',
    category_id: '',
    tags: []
  }, 
  categories = [],
  tags = [],
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isEditing = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [formErrors, setFormErrors] = useState({});
  
  // Mettre à jour le formulaire si les données initiales changent
  useEffect(() => {
    if (initialData) {
      // Préparer les tags pour le formulaire (convertir en array d'IDs)
      const tagIds = initialData.tags 
        ? initialData.tags.map(tag => tag.id)
        : [];
      
      setFormData({
        ...initialData,
        tags: tagIds,
      });
    }
  }, [initialData]);
  
  // Gestionnaire de changement pour les champs simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Gestionnaire pour les tags (sélection multiple)
  const handleTagChange = (e) => {
    const tagId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    setFormData(prev => {
      let updatedTags = [...prev.tags];
      
      if (isChecked) {
        // Ajouter le tag s'il n'est pas déjà présent
        if (!updatedTags.includes(tagId)) {
          updatedTags.push(tagId);
        }
      } else {
        // Retirer le tag
        updatedTags = updatedTags.filter(id => id !== tagId);
      }
      
      return { ...prev, tags: updatedTags };
    });
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Le titre est requis';
    }
    
    if (!formData.price) {
      errors.price = 'Le prix est requis';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Le prix doit être un nombre positif';
    }
    
    if (!formData.category_id) {
      errors.category_id = 'La catégorie est requise';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Préparer les données pour l'API
      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
      };
      
      onSubmit(courseData);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? 'Modifier le cours' : 'Créer un nouveau cours'}
      </h2>
      
      {/* Afficher le message d'erreur s'il y en a un */}
      {error && <ErrorMessage error={error} />}
      
      <form onSubmit={handleSubmit}>
        {/* Titre */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
            disabled={loading}
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
          )}
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={loading}
          />
        </div>
        
        {/* Prix */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Prix * (€)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
            disabled={loading}
          />
          {formErrors.price && (
            <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
          )}
        </div>
        
        {/* Catégorie */}
        <div className="mb-4">
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={`w-full border ${formErrors.category_id ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
            disabled={loading}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formErrors.category_id && (
            <p className="mt-1 text-sm text-red-600">{formErrors.category_id}</p>
          )}
        </div>
        
        {/* Tags */}
        <div className="mb-6">
          <p className="block text-sm font-medium text-gray-700 mb-2">Tags</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  value={tag.id}
                  checked={formData.tags.includes(tag.id)}
                  onChange={handleTagChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  disabled={loading}
                />
                <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-gray-700">
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <Loader size="small" text="" />
                <span className="ml-2">
                  {isEditing ? 'Mise à jour...' : 'Création...'}
                </span>
              </span>
            ) : (
              isEditing ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;