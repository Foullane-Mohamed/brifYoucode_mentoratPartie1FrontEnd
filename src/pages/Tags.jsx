import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { tagService, statsService } from '../services/api';
import TagList from '../components/tags/TagList';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [courseCounts, setCourseCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // Charger les tags et les statistiques
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tagsResponse, statsResponse] = await Promise.all([
          tagService.getAll(),
          statsService.getTagStats(),
        ]);
        
        setTags(tagsResponse.data);
        
        // Préparer un objet avec le nombre de cours par tag
        const counts = {};
        if (statsResponse.data.tags_by_courses_count) {
          statsResponse.data.tags_by_courses_count.forEach(item => {
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
  
  // Ouvrir le formulaire pour créer un nouveau tag
  const handleAddTag = () => {
    setCurrentTag(null);
    setFormData({ name: '', description: '' });
    setFormError(null);
    setShowForm(true);
  };
  
  // Ouvrir le formulaire pour modifier un tag existant
  const handleEditTag = (tag) => {
    setCurrentTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || '',
    });
    setFormError(null);
    setShowForm(true);
  };
  
  // Fermer le formulaire
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentTag(null);
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
      setFormError({ message: 'Le nom du tag est requis' });
      return;
    }
    
    setFormLoading(true);
    try {
      if (currentTag) {
        // Modification d'un tag existant
        const response = await tagService.update(currentTag.id, formData);
        
        // Mettre à jour la liste des tags
        setTags(prev => 
          prev.map(tag => 
            tag.id === currentTag.id ? response.data : tag
          )
        );
        
        toast.success('Le tag a été mis à jour avec succès');
      } else {
        // Création d'un nouveau tag
        const response = await tagService.create(formData);
        
        // Ajouter le nouveau tag à la liste
        setTags(prev => [...prev, response.data]);
        
        toast.success('Le tag a été créé avec succès');
      }
      
      // Fermer le formulaire
      setShowForm(false);
      setCurrentTag(null);
      setFormData({ name: '', description: '' });
      setFormError(null);
    } catch (err) {
      setFormError(err);
      toast.error('Une erreur est survenue');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Supprimer un tag
  const handleDeleteTag = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) {
      return;
    }
    
    try {
      await tagService.delete(id);
      
      // Supprimer le tag de la liste
      setTags(prev => prev.filter(tag => tag.id !== id));
      
      toast.success('Le tag a été supprimé avec succès');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tags</h1>
        <button
          onClick={handleAddTag}
          className="bg-primary text-white font-medium px-4 py-2 rounded-md hover:bg-primary-dark transition"
        >
          Ajouter un tag
        </button>
      </div>
      
      {/* Formulaire de création/modification */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            {currentTag ? 'Modifier le tag' : 'Créer un nouveau tag'}
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
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                disabled={formLoading}
              >
                {formLoading ? (
                  <span className="flex items-center">
                    <Loader size="small" text="" />
                    <span className="ml-2">
                      {currentTag ? 'Mise à jour...' : 'Création...'}
                    </span>
                  </span>
                ) : (
                  currentTag ? 'Mettre à jour' : 'Créer'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Liste des tags */}
      <TagList
        tags={tags}
        courseCounts={courseCounts}
        loading={loading}
        error={error}
        onEdit={handleEditTag}
        onDelete={handleDeleteTag}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default Tags;