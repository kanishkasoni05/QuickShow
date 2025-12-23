import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

export const getNowPlayingMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ release_date: -1 }).limit(10); // Or any logic
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//API to add a new show to db
export const addShow = async (req, res)=> {
    try{
        const {movieId, showsInput, showPrice} = req.body
        let movie = await Movie.findById(movieId)

        if (!movie) {
          return res.json({ success: false, message: "Movie not found in database. Please add it first." });
         }

          const showsToCreate = [];
          showsInput.forEach(show => {
            const showDate = show.date;
          show.time.forEach((time)=>{
             const dateTimeString = `${showDate}T${time}`;
              showsToCreate.push({
                movie: movieId,
                showDateTime: new Date(dateTimeString),
                showPrice,
                occupiedSeats: {}
             })
        })
    });

        if(showsToCreate.length > 0){
           await Show.insertMany(showsToCreate);
        }

        //Trigger Inngest event
        await inngest.send({
          name: "app/show.added",
          data: {movieTitle: movie.title}
        })

       res.json({success: true, message: 'Show Added Successfully'})
    } catch(error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}
//API to get all shows from db
export const getShows = async(req, res)=> {
    try{
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate
        ('movie').sort({showDateTime: 1});

        //filter unique shows```
        const uniqueShows = new Set(shows.map(show=> show.movie))

        res.json({success: true, shows: Array.from(uniqueShows)})
    } catch(error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

//API to get a single show from db
export const getShow = async(req, res)=> {
  try{
       const{movieId} = req.params;

    //get all upcoming shows for movie
      const shows  = await Show.find({movie: movieId, showDateTime: {$gte: new
        Date() }})   

     const movie = await Movie.findById(movieId);
     const dateTime = {};

     shows.forEach((show)=> {
       const date = show.showDateTime.toISOString().split("T")[0];
       if(!dateTime[date]){
         dateTime[data] = []
       }
         dateTime[date].push({time: show.showDateTime, showId: show._Id})
     })
       res.json({success: true, movie, dateTime})
  } catch(error) {
    console.error(error);
    res.json({success: false, message: error.message});
  }
}
