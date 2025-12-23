import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowRightIcon } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import isoTimeFormat from '../lib/isoTimeFormat';
import { assets } from '../assets/assets';

const SeatLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [seatCount, setSeatCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  const seatPricing = {
    front: 100,
    middle: 150,
    back: 200,
  };

  const groupRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, 'movies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document");
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
      setOccupiedSeats([]);
    }, [selectedTime]);

  const handleSeatClick = (seatId, price) => {
    if (!selectedTime) return toast("Please select time first");
    if (occupiedSeats.includes(seatId)) return toast("Seat already booked");
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
      setTotalAmount((prev) => prev - price);
    } else {
      if (selectedSeats.length >= seatCount)
        return toast("You can only select chosen number of seats");
      setSelectedSeats((prev) => [...prev, seatId]);
      setTotalAmount((prev) => prev + price);
    }
  };

  const getSeatPrice = (row) => {
    if (["A", "B", "C"].includes(row)) return seatPricing.front;
    if (["D", "E", "F", "G"].includes(row)) return seatPricing.middle;
    return seatPricing.back;
  };

  const renderSeats = (row, count = 10) => {
    const price = getSeatPrice(row);
    return (
      <div key={row} className="flex justify-center gap-1 items-center w-full">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId, price)}
              className={`h-8 w-8 rounded border border-primary/60 text-xs
                ${selectedSeats.includes(seatId) && "bg-primary text-white"}
                ${occupiedSeats.includes(seatId) && "opacity-50 cursor-not-allowed"}
                `}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    );
  };

  const bookTickets = () => {
    if (!selectedTime || selectedSeats.length === 0) {
      return toast.error("Please select time and at least 1 seat");
    }
    if (selectedSeats.length !== seatCount) {
      return toast.error("Please select exactly " + seatCount + " seats");
    }

    //toast.success("Booking successful!");
    navigate("/payment", { state: { movie, selectedTime, selectedSeats, totalAmount } });
  };

  if (!movie) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Sidebar: Date and Time */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 
      h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6 mb-2">Select Date</p>
        <select
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime(null);
          }}
          className="block w-44 mx-6 mb-4 px-4 py-2 rounded border border-primary bg-transparent text-white"
          defaultValue=""
        >
          <option value="" disabled>Select Date</option>
          {movie.timings && Object.keys(movie.timings).map((date) => (
            <option value={date} key={date} className="text-black">
              {date}
            </option>
          ))}
        </select>

        <p className="text-lg font-semibold px-6 mt-4">Available Timings</p>
        <select
          onChange={(e) => {
            const time = e.target.value;
            if (time) {
              setSelectedTime({ time, showId: movie.id, date: selectedDate });
            }
          }}
          className="block w-44 mx-6 mb-4 px-4 py-2 rounded border border-primary 
          bg-transparent text-white"
          disabled={!selectedDate}
          value={selectedTime?.time || ""}
        >
          <option value="" disabled>Select Time</option>
          {selectedDate &&
            movie.timings[selectedDate]?.map((time, index) => (
              <option key={index} value={time} className="text-black">
                {time}
              </option>
            ))}
        </select>
      </div>

    {/* Main Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle bottom="0" right="0" />

   <img src={assets.screenImage} alt="screen" className="mb-2" />
   <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

  {/* Seat Layout with Sections */}
   <div className="w-full max-w-[460px] flex flex-col items-center
    gap-4 text-xs text-gray-300">

    {/* Front Rows */}
    <div className="w-full">
      <div className="flex justify-between px-2 mb-1">
        <span className="text-sm">Executive</span>
        <span className="text-sm font-bold text-green-500">₹{seatPricing.front}</span>
      </div>
      {["A", "B", "C"].map((row) => renderSeats(row))}
    </div>

    {/* Middle Rows */}
    <div className="w-full">
      <div className="flex justify-between px-2 mb-1">
        <span className="text-sm">Club</span>
        <span className="text-sm font-bold text-green-500">₹{seatPricing.middle}</span>
      </div>
      {["D", "E", "F", "G"].map((row) => renderSeats(row))}
    </div>

    {/* Back Rows */}
    <div className="w-full">
      <div className="flex justify-between px-2 mb-1">
        <span className="text-sm">Royale</span>
        <span className="text-sm font-bold text-green-500">₹{seatPricing.back}</span>
      </div>
      {["H", "I", "J"].map((row) => renderSeats(row))}
    </div>
  </div>

  <h1 className="text-2xl font-semibold mt-10 mb-4">How many seats?</h1>
  <select
    value={seatCount}
    onChange={(e) => {
      setSelectedSeats([]);
      setTotalAmount(0);
      setSeatCount(parseInt(e.target.value));
    }}
    className="mb-6 px-4 py-2 rounded border border-primary bg-transparent text-white"
  >
    {Array.from({ length: 10 }, (_, i) => (
      <option key={i + 1} value={i + 1} className="text-black">
        {i + 1}
      </option>
    ))}
  </select>

  <p className="mt-4 text-sm text-white">Total: ₹{totalAmount}</p>

  <button
    onClick={bookTickets}
    className="flex items-center gap-1 mt-6 px-10 py-3 text-sm bg-primary hover:bg-primary-dull 
      transition rounded-full font-medium cursor-pointer active:scale-95"
  >
    Proceed to Checkout
    <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
  </button>
</div>
</div>
 
);
};

export default SeatLayout;