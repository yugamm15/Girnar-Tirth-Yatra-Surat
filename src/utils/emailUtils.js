import emailjs from '@emailjs/browser';

// IMPORTANT: Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_p4fsbrg';
const EMAILJS_TEMPLATE_ID = 'template_mbxwo78';
const EMAILJS_PUBLIC_KEY = '3q8LVh7ibndOKU2Mm';

export const sendTicketEmail = async (bookingInfo, paymentId, yatraDateText, yatraImage, yatricks) => {
  try {
    // Assuming the primary booker is the first yatrik
    const primaryYatrik = yatricks[0];
    const emailTo = primaryYatrik.email;

    if (!emailTo) {
      console.warn('No email provided for ticket confirmation.');
      return;
    }

    // Format the list of yatricks for the email body
    const passengerDetailsHTML = yatricks.map((y, idx) => {
      // Calculate age from birthdate
      const birthDate = new Date(y.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><b>${y.firstName} ${y.lastName}</b></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${y.gender}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${age}</td>
      </tr>
      `;
    }).join('');

    const templateParams = {
      to_email: emailTo,
      to_name: `${primaryYatrik.firstName} ${primaryYatrik.lastName}`,
      yatra_date: yatraDateText,
      yatra_image: yatraImage,
      payment_id: paymentId,
      total_amount: `₹${bookingInfo.totalAmount}`,
      passenger_count: yatricks.length,
      passenger_details: passengerDetailsHTML,
      important_note: 'Tickets cannot be canceled and there will be no refund on cancellation. Bus number and seat number will be sent to you via WhatsApp.'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Ticket email sent successfully!', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Failed to send ticket email:', error);
  }
};
