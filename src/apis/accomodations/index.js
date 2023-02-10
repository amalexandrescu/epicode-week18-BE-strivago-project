import express from "express";
import AccomodationsModel from "./model.js";
const accomodationsRouter = express.Router();

accomodationsRouter.post("/", async (req, res, next) => {
  try {
    const newAccomodation = await AccomodationsModel(req.body);
    const { _id } = await newAccomodation.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

export default accomodationsRouter;
