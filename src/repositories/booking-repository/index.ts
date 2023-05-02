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

async function createBookings({ userId, roomId }: NewBookings): Promise<Booking> {
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
