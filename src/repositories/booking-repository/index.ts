import { Booking } from '@prisma/client';
import { prisma } from '@/config';

type NewBookings = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateBookings = Omit<Booking, 'createdAt' | 'updatedAt'>;

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

async function createBookings({ roomId, userId }: NewBookings): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function getBookingsRoom(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function updateBooking({ id, roomId, userId }: UpdateBookings) {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      roomId,
      userId,
    },
    update: {
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
