import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [user, setUser] = useState(null);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || '';
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const getToken = () => localStorage.getItem("token");

  // ✅ Detect user login state using Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem("user", JSON.stringify(firebaseUser));
        toast.success("Login successful!");
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // ✅ Logout function using Firebase
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  // ✅ Fetch shows from Firebase
  const fetchShows = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "movies"));
      const movies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Movies fetched from Firebase:", movies);
      setShows(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [user]);

  const value = {
    axios,
    user,
    logout,
    getToken,
    navigate,
    isAdmin,
    shows,
    setShows,
    favoriteMovies,
    fetchFavoriteMovies,
    fetchIsAdmin,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);