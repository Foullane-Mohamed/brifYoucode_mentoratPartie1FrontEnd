import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseService, categoryService, tagService } from '../services/api';
import CourseList from '../components/courses/CourseList';
import CourseForm from '../components/courses/CourseForm';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer les paramètres d'URL
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const tagParam = queryParams.get('tag');
  
  // Charger les cours, catégories et tags
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesResponse, categoriesResponse, tagsResponse] = await Promise.all([
          courseService.getAll(),
          categoryService.getAll(),
          tagService.getAll(),
        ]);
        
        setCourses(coursesResponse.data);
        setCategories(categoriesResponse.data);
        setTags(tagsResponse.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Ouvrir le formulaire pour créer un nouveau cours
  const handleAddCourse = () => {
    setCurrentCourse(null);
    setFormError(null);
    setShowForm(true);
  };
  
  // Ouvrir le formulaire pour modifier un cours existant
  const handleEditCourse = (course) => {
    setCurrentCourse(course);
    setFormError(null);
    setShowForm(true);
  };
  
  // Fermer le formulaire
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentCourse(null);
    setFormError(null);
  };
  
  // Soumettre le formulaire pour créer ou modifier un cours
  const handleSubmitForm = async (courseData) => {
    setFormLoading(true);
    try {
      if (currentCourse) {
        // Modification d'un cours existant
        const response = await courseService.update(currentCourse.id, courseData);
        
        // Mettre à jour la liste des cours
        setCourses(prev => 
          prev.map(course => 
            course.id === currentCourse.id ? response.data : course
          )
        );
        
        toast.success('Le cours a été mis à jour avec succès');
      } else {
        // Création d'un nouveau cours
        const response = await courseService.create(courseData);
        
        // Ajouter le nouveau cours à la liste
        setCourses(prev => [...prev, response.data]);
        
        toast.success('Le cours a été créé avec succès');
      }
      
      // Fermer le formulaire
      setShowForm(false);
      setCurrentCourse(null);
      setFormError(null);
    } catch (err) {
      setFormError(err);
      toast.error('Une erreur est survenue');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Supprimer un cours
  const handleDeleteCourse = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      return;
    }
    
    try {
      await courseService.delete(id);
      
      // Supprimer le cours de la liste
      setCourses(prev => prev.filter(course => course.id !== id));
      
      toast.success('Le cours a été supprimé avec succès');
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
        <h1 className="text-3xl font-bold">Cours</h1>
        <button
          onClick={handleAddCourse}
          className="bg-primary text-white font-medium px-4 py-2 rounded-md hover:bg-primary-dark transition"
        >
          Ajouter un cours
        </button>
      </div>
      
      {/* Formulaire de création/modification */}
      {showForm && (
        <div className="mb-8">
          <CourseForm
            initialData={currentCourse}
            categories={categories}
            tags={tags}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={formLoading}
            error={formError}
            isEditing={!!currentCourse}
          />
        </div>
      )}
      
      {/* Liste des cours */}
      <CourseList
        courses={courses}
        loading={loading}
        error={error}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default Courses;