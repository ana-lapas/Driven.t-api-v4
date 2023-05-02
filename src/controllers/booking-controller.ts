import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const bookings = await bookingService.getBookings(userId);
    return res.status(httpStatus.OK).send(bookings);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND).send(error);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { roomId } = req.body;
    if (!roomId) return res.sendStatus(httpStatus.NOT_FOUND);

    const newBooking = await bookingService.postBookings(userId, Number(roomId));

    return res.status(httpStatus.OK).send({
      bookingId: newBooking.id,
    });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === 'ForbiddenError') {
      return res.status(httpStatus.FORBIDDEN).send(error);
    }
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { bookingId } = req.params;
    const { roomId } = req.body;
    const newBooking = await bookingService.updateBookings(userId, Number(bookingId), Number(roomId));

    return res.status(httpStatus.OK).send({
      bookingId: newBooking.id,
    });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === 'ForbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN).send(error);
    }
  }
}
