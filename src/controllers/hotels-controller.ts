import { Request, Response } from "express";
import httpStatus from "http-status";
import hotelsService from "@/services/hotels-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels = hotelsService.getHotelsPaidByUserId(+userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
