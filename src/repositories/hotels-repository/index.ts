import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function findHotel() {
  return await prisma.hotel.findMany();
}

const hotelsRepository = {
  findHotel
};

export default hotelsRepository;
