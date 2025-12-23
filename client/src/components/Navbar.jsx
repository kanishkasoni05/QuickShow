import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, XIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import LoginModal from '../components/LoginModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { favoriteMovies, user, logout } = useAppContext();

  const handleNavLinkClick = (path) => {
    scrollTo(0, 0);
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* ✅ Login Modal */}
      {showLogin && <LoginModal setShowLogin={setShowLogin} />}

      <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between 
      px-6 md:px-16 lg:px-36 py-5 bg-black/80 backdrop-blur'>

        {/* Logo */}
        <Link to='/' className='max-md:flex-1'>
          <img src={assets.logo} alt="Logo" className='w-36 h-auto' />
        </Link>

        {/* Nav Links */}
        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
          max-md:text-lg z-50 flex flex-col md:flex-row items-center
          max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
          min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
          border-gray-300/20 overflow-hidden transition-[width] 
          duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

          <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(false)} />

          <Link onClick={() => handleNavLinkClick('/')} to='/'>Home</Link>
          <Link onClick={() => handleNavLinkClick('/movies')} to='/movies'>Movies</Link>
          <Link onClick={() => handleNavLinkClick('/')} to='/'>Theaters</Link>
          <Link onClick={() => handleNavLinkClick('/')} to='/'>Releases</Link>
          {favoriteMovies.length > 0 && (
            <Link onClick={() => handleNavLinkClick('/favorite')} to='/favorite'>Favorites</Link>
          )}
        </div>

        {/* Right Side: Login/Profile */}
        <div className='flex items-center gap-6'>
          <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />

          {user ? (
            <div className="relative group">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user
            .displayName || user.email}&background=random`} alt="Profile"
            className="w-9 h-9 rounded-full cursor-pointer border-2 border-white"/>
        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md p-2 
        text-sm hidden group-hover:block">
          <p>{user.displayName || user.email}</p>
        <button onClick={logout} className="mt-2 px-3 py-1 bg-red-500 text-white 
          rounded hover:bg-red-600 w-full">Logout
        </button>
         </div>
      </div>
     ) : (
        <button onClick={() => setShowLogin(true)} className='px-4 py-1 sm:px-7 sm:py-2
         bg-primary text-white hover:bg-primary-dull transition rounded-full font-medium 
         cursor-pointer'>Login
        </button>
     )}
      </div>

        <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'
          onClick={() => setIsOpen(!isOpen)} />
      </div>
    </>
  );
};

export default Navbar;