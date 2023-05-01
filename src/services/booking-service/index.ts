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
    throw unauthorizedError();
  }
  return { enrollment, ticket };
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
  if (!roomId) throw notFoundError();

  await checkBooking(userId);
  const bookings = await bookingRepository.getBooking(userId);
  if (!bookings) throw forbiddenError();

  const room = await roomRepository.getRoomById(bookings.roomId);
  if (!room) throw notFoundError();

  const checkBookings = await bookingRepository.getBookingsRoom(bookings.roomId);
  if (room.capacity <= checkBookings.length) throw forbiddenError();

  const newBooking = await bookingRepository.createBookings({ userId, roomId });
  const bookingInfo = {
    bookingId: newBooking.id,
  };
  return bookingInfo;
}

async function updateBookings(userId: number, bookingId: number, roomId: number) {
  await checkBooking(userId);
  const existingBookings = await bookingRepository.getBooking(userId);
  if (!existingBookings) throw forbiddenError();

  const room = await roomRepository.getRoomById(existingBookings.roomId);
  if (!room) throw notFoundError();

  const checkNewBookings = await bookingRepository.getBookingsRoom(roomId);
  if (!checkNewBookings) throw notFoundError();
  if (room.capacity <= checkNewBookings.length) throw forbiddenError();

  const id = bookingId;
  await bookingRepository.updateBooking({ id, roomId });
  return id;
}

export default {
  getBookings,
  postBookings,
  updateBookings,
};
