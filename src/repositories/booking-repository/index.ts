import { Booking } from '@prisma/client';
import { prisma } from '@/config';

type NewBookings = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateBookings = Omit<Booking, 'userId' | 'createdAt' | 'updatedAt'>;

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function createBookings({ userId, roomId }: NewBookings) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function getBookingsRoom(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function updateBooking({ id, roomId }: UpdateBookings) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
    },
  });
}

const bookingRepository = {
  getBooking,
  createBookings,
  getBookingsRoom,
  updateBooking,
};

export default bookingRepository;
