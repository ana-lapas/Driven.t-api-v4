import { forbiddenError, notFoundError, unauthorizedError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingRepository from '@/repositories/booking-repository';
import roomRepository from '@/repositories/room-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function checkBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === 'RESERVED') {
    throw forbiddenError();
  }
}

async function getBookings(userId: number) {
  await checkBooking(userId);

  const bookings = await bookingRepository.getBooking(userId);
  if (!bookings) throw notFoundError();

  const bookingsData = {
    id: bookings.id,
    Room: bookings.Room,
  };
  return bookingsData;
}

async function postBookings(userId: number, roomId: number) {
  await checkBooking(userId);

  const existingRoom = await roomRepository.getRoomById(roomId);
  if (!existingRoom) {
    throw notFoundError();
  }

  const bookings = await bookingRepository.getBooking(userId);
  if (!bookings) {
    throw forbiddenError();
  }

  const checkBookings = await bookingRepository.getBookingsRoom(bookings.roomId);
  if (existingRoom.capacity <= checkBookings.length) {
    throw unauthorizedError();
  }

  return bookingRepository.createBookings({
    userId,
    roomId,
  });
}

async function updateBookings(userId: number, bookingId: number, roomId: number) {
  await checkBooking(userId);
  const existingNewRoom = await roomRepository.getRoomById(roomId);
  if (!existingNewRoom) {
    throw notFoundError();
  }

  const existingBookings = await bookingRepository.getBooking(userId);
  if (!existingBookings) {
    throw forbiddenError();
  }

  const checkNewBookings = await bookingRepository.getBookingsRoom(roomId);
  if (existingNewRoom.capacity <= checkNewBookings.length) {
    throw forbiddenError();
  }
  return bookingRepository.updateBooking({
    id: bookingId,
    roomId,
    userId,
  });
}

export default {
  getBookings,
  postBookings,
  updateBookings,
};
