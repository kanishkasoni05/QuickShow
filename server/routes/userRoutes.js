import express from "express";
import { getFavorites, getUserBookings, updateFavorite, loginUser } from "../controllers/userController.js";

const userRouter = express.Router();


userRouter.post('/login', loginUser);
userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favorite', updateFavorite);
userRouter.get('/favorites', getFavorites);

export default userRouter;
