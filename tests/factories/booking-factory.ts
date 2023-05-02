import { prisma } from '@/config';

type NewBooking = {
  roomId: number;
  userId: number;
};

export function createBooking({ roomId, userId }: NewBooking) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
