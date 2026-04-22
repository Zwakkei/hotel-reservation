from django.core.mail import send_mail
from django.conf import settings

def send_booking_confirmation(reservation):
    subject = f'Booking Confirmed - {reservation.room.name}'
    message = f"""
Dear {reservation.user.username},

Your booking has been confirmed!

Booking Details:
- Room: {reservation.room.name}
- Check-in: {reservation.check_in}
- Check-out: {reservation.check_out}
- Total: ₱{reservation.total_price}

Thank you for choosing HotelReservation!

Visit your dashboard to manage your booking:
http://localhost:5173/dashboard
"""
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [reservation.user.email])