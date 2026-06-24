import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Load all blogs
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'blogs'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const blogData = [];
      snapshot.forEach(doc => {
        blogData.push({ id: doc.id, ...doc.data() });
      });
      setBlogs(blogData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(blogData.map(b => b.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setLoading(false);
    }
  };

  // Get single blog by slug
  const getBlogBySlug = async (slug) => {
    try {
      const q = query(
        collection(db, 'blogs'),
        where('slug', '==', slug)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  };

  // Get single blog by ID
  const getBlogById = async (id) => {
    try {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  };

  // Add blog
  const addBlog = async (blogData) => {
    try {
      const data = {
        ...blogData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        status: 'published'
      };
      const docRef = await addDoc(collection(db, 'blogs'), data);
      await loadBlogs();
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error adding blog:', error);
      throw error;
    }
  };

  // Update blog
  const updateBlog = async (id, blogData) => {
    try {
      const docRef = doc(db, 'blogs', id);
      await updateDoc(docRef, {
        ...blogData,
        updatedAt: serverTimestamp()
      });
      await loadBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      await loadBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  };

  // Increment views
  const incrementViews = async (id) => {
    try {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0;
        await updateDoc(docRef, { views: currentViews + 1 });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const value = {
    blogs,
    loading,
    categories,
    loadBlogs,
    getBlogBySlug,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog,
    incrementViews
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;