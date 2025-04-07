import axios from 'axios';

const BASE_URL = '/api/V1';

// Configuration d'Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Services pour les cours
export const courseService = {
  getAll: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  create: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  update: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Services pour les catégories
export const categoryService = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  create: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Services pour les tags
export const tagService = {
  getAll: async () => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/tags/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  create: async (tagData) => {
    try {
      const response = await api.post('/tags', tagData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  update: async (id, tagData) => {
    try {
      const response = await api.put(`/tags/${id}`, tagData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/tags/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Services pour les statistiques
export const statsService = {
  getCourseStats: async () => {
    try {
      const response = await api.get('/stats/courses');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getCategoryStats: async () => {
    try {
      const response = await api.get('/stats/categories');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getTagStats: async () => {
    try {
      const response = await api.get('/stats/tags');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Gestion des erreurs API
const handleApiError = (error) => {
  if (error.response) {
    // La requête a été faite et le serveur a répondu avec un code d'état
    return {
      status: error.response.status,
      message: error.response.data.message || 'Une erreur est survenue',
      errors: error.response.data.errors || {},
    };
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    return {
      status: 503,
      message: 'Aucune réponse du serveur',
      errors: {},
    };
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    return {
      status: 500,
      message: error.message || 'Une erreur est survenue',
      errors: {},
    };
  }
};

export default {
  courseService,
  categoryService,
  tagService,
  statsService,
};