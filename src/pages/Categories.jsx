import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { categoryService, statsService } from '../services/api';
import CategoryList from '../components/categories/CategoryList';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [courseCounts, setCourseCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // Charger les catégories et les statistiques
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, statsResponse] = await Promise.all([
          categoryService.getAll(),
          statsService.getCategoryStats(),
        ]);
        
        setCategories(categoriesResponse.data);
        
        // Préparer un objet avec le nombre de cours par catégorie
        const counts = {};
        if (statsResponse.data.categories_by_courses_count) {
          statsResponse.data.categories_by_courses_count.forEach(item => {
            counts[item.id] = item.courses_count;
          });
        }
        setCourseCounts(counts);
        
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Ouvrir le formulaire pour créer une nouvelle catégorie
  const handleAddCategory = () => {
    setCurrentCategory(null);
    setFormData({ name: '', description: '' });
    setFormError(null);
    setShowForm(true);
  };
  
  // Ouvrir le formulaire pour modifier une catégorie existante
  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setFormError(null);
    setShowForm(true);
  };
  
  // Fermer le formulaire
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentCategory(null);
    setFormData({ name: '', description: '' });
    setFormError(null);
  };
  
  // Mettre à jour les données du formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Soumettre le formulaire
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.name.trim()) {
      setFormError({ message: 'Le nom de la catégorie est requis' });
      return;
    }
    
    setFormLoading(true);
    try {
      if (currentCategory) {
        // Modification d'une catégorie existante
        const response = await categoryService.update(currentCategory.id, formData);
        
        // Mettre à jour la liste des catégories
        setCategories(prev => 
          prev.map(category => 
            category.id === currentCategory.id ? response.data : category
          )
        );
        
        toast.success('La catégorie a été mise à jour avec succès');
      } else {
        // Création d'une nouvelle catégorie
        const response = await categoryService.create(formData);
        
        // Ajouter la nouvelle catégorie à la liste
        setCategories(prev => [...prev, response.data]);
        
        toast.success('La catégorie a été créée avec succès');
      }
      
      // Fermer le formulaire
      setShowForm(false);
      setCurrentCategory(null);
      setFormData({ name: '', description: '' });
      setFormError(null);
    } catch (err) {
      setFormError(err);
      toast.error('Une erreur est survenue');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Supprimer une catégorie
  const handleDeleteCategory = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }
    
    try {
      await categoryService.delete(id);
      
      // Supprimer la catégorie de la liste
      setCategories(prev => prev.filter(category => category.id !== id));
      
      toast.success('La catégorie a été supprimée avec succès');
    } catch (err) {
      toast.error('Une erreur est survenue lors de la suppression');
    }
  };
  
  // Réessayer en cas d'erreur
  const handleRetry = () => {
    // Recharger la page
    window.location.reload();
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-20 mb-6">
        <h1 className="text-3xl text-black font-bold">Catégories</h1>
        <button
          onClick={handleAddCategory}
          className="bg-primary text-2xl font-semibold mb-6 font-medium px-4 py-2 rounded-md hover:bg-primary-dark transition"
        >
          Ajouter une catégorie
        </button>
      </div>
      
      {/* Formulaire de création/modification */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            {currentCategory ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}
          </h2>
          
          {formError && (
            <div className="mb-4">
              <ErrorMessage error={formError} />
            </div>
          )}
          
          <form onSubmit={handleSubmitForm}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={formLoading}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={formLoading}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                disabled={formLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2  bg-primary text-white rounded-md hover:bg-primary-dark transition"
                disabled={formLoading}
              >
                {formLoading ? (
                  <span className="flex items-center">
                    <Loader size="small" text="" />
                    <span className="ml-2">
                      {currentCategory ? 'Mise à jour...' : 'Création...'}
                    </span>
                  </span>
                ) : (
                  currentCategory ? 'Mettre à jour' : 'Créer'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Liste des catégories */}
      <CategoryList
        categories={categories}
        courseCounts={courseCounts}
        loading={loading}
        error={error}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default Categories;