import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Movies = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieRef = collection(db, 'movies');
        const data = await getDocs(movieRef);
        const formatted = data.docs.map(doc => ({
          _id: doc.id, // to match your MovieCard prop
          ...doc.data(),
        }));
        setShows(formatted);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No movies available</h1>
    </div>
  );
};

export default Movies;