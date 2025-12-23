import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import BlurCircle from '../components/BlurCircle';
import DateSelect from '../components/DateSelect';
import Loading from '../components/Loading';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, 'movies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <Loading />;

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img
          src={movie.poster}
          alt={movie.title}
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'
        />

        <div className='relative flex flex-col gap-3'>
          <BlurCircle top='-100px' left='-100px' />
          <p className='text-primary'>{movie.language}</p>
          <h1 className='text-4xl font-semibold max-w-96'>{movie.title}</h1>
          <p>{movie.duration} • {movie.theatre}</p>

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <a
              href='#dateSelect'
              className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
            >
              Book Tickets
            </a>
            <button
              onClick={() => navigate('/movies')}
              className='px-10 py-3 text-sm bg-gray-700 hover:bg-gray-800 rounded-md font-medium'
            >
              Back to Movies
            </button>
          </div>
        </div>
      </div>

      <div id='dateSelect' className='mt-16'>
        <DateSelect dateTime={movie.timings} id={movie.id} />
      </div>
    </div>
  );
};

export default MovieDetails;