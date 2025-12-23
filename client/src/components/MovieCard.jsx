import { StarIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../lib/timeFormat';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const movieId = movie.id || movie._id; // ✅ Firebase ke liye id, aur agar _id ho to fallback

  console.log("Movie from MovieCard:", movie);

  return (
    <div
      className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl 
      hover:-translate-y-1 transition duration-300 w-66'
    >
      <img
        onClick={() => {
          navigate(`/movies/${movieId}`);
          scrollTo(0, 0);
        }}
        src={movie.poster || movie.backdrop || '/fallback.jpg'} // ✅ image fallback
        alt={movie.title}
        className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer'
      />

      <p className='font-semibold mt-2 truncate'>{movie.title}</p>

      <p className='text-sm text-gray-400 mt-2'>
        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} •{" "}
        {Array.isArray(movie.genres) ? movie.genres.slice(0, 2).join(" | ") : "Genre"} •{" "}
        {movie.duration ? timeFormat(movie.duration) : "Duration"}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button
          onClick={() => {
            navigate(`/movies/${movieId}`);
            scrollTo(0, 0);
          }}
          className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull
          transition rounded-full font-medium cursor-pointer'
        >
          Buy Tickets
        </button>

        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.rating ? movie.rating.toFixed(1) : "4.5"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;