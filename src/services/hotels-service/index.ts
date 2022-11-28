import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "../../repositories/hotels-repository/index";
import ticketRepository from "../../repositories/ticket-repository";

async function getHotelsPaidByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  
  if(!enrollment) throw notFoundError();

  const ticketPaidHotel = await ticketRepository.ticketTypeUser(enrollment.id);

  if(!ticketPaidHotel) throw notFoundError();

  if(ticketPaidHotel.status !== "PAID") throw unauthorizedError();

  if(!ticketPaidHotel.TicketType.includesHotel) throw unauthorizedError();
  
  return hotelsRepository.findHotel();
}

const hotelsService = {
  getHotelsPaidByUserId
};

export default hotelsService;
