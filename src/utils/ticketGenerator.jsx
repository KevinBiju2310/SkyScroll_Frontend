import jsPDF from "jspdf";
import QRCode from "qrcode";

const ticketGenerator = async (booking) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper functions
  const centerText = (text, y) => {
    const textWidth =
      (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  const drawSection = (startY, endY, title) => {
    // Section background   
    doc.setFillColor(249, 250, 251);
    doc.rect(15, startY - 3, pageWidth - 30, endY - startY + 6, "F");

    // Section border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.rect(15, startY - 3, pageWidth - 30, endY - startY + 6);

    if (title) {
      // Section title background
      doc.setFillColor(237, 242, 247);
      doc.rect(15, startY - 3, pageWidth - 30, 8, "F");

      // Section title
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.setFont(undefined, "bold");
      doc.text(title, 20, startY + 2);
      doc.setFont(undefined, "normal");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  try {
    // Header
    doc.setFillColor(0, 87, 168);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    centerText("BOARDING PASS", 12);

    doc.setFontSize(14);
    centerText(booking.flightId.airline?.airlineName || "Airline", 20);

    // Main ticket border
    doc.setDrawColor(0, 87, 168);
    doc.setLineWidth(1);
    doc.rect(10, 30, pageWidth - 20, pageHeight - 40);

    // Flight Details Section
    let currentY = 40;
    drawSection(currentY, currentY + 25, "Flight Details");

    const leftCol = 25;
    const rightCol = pageWidth / 2 + 10;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);

    currentY += 12;
    doc.setFont(undefined, "bold");
    doc.text("Flight:", leftCol, currentY);
    doc.text("Class:", rightCol, currentY);

    doc.setFont(undefined, "normal");
    doc.text(
      booking.flightId.segments[0]?.flightNumber || "N/A",
      leftCol + 20,
      currentY
    );
    doc.text(booking.travelClass, rightCol + 20, currentY);

    currentY += 8;
    doc.setFont(undefined, "bold");
    doc.text("From:", leftCol, currentY);
    doc.text("To:", rightCol, currentY);

    doc.setFont(undefined, "normal");
    doc.text(
      booking.flightId.segments[0]?.departureAirport?.name || "N/A",
      leftCol + 20,
      currentY
    );
    doc.text(
      booking.flightId.segments[booking.flightId.segments.length - 1]
        ?.arrivalAirport?.name || "N/A",
      rightCol + 20,
      currentY
    );

    // Seats Section
    currentY += 15;
    drawSection(currentY, currentY + 15, "Seats");
    currentY += 10;
    doc.setFont(undefined, "bold");
    doc.text("Assigned:", leftCol, currentY);
    doc.setFont(undefined, "normal");
    const seatAssignments = Array.from(booking.selectedSeats || [])
      .map(([key, value]) => `${key}: ${value.join(", ")}`)
      .join(" | ");
    doc.text(seatAssignments || "No seats assigned", leftCol + 25, currentY);

    // Passenger Details Section
    currentY += 15;
    const passengerHeight = booking.passengers.length * 25 + 5;
    drawSection(currentY, currentY + passengerHeight, "Passenger Details");

    booking.passengers.forEach((passenger, index) => {
      const passengerY = currentY + 12 + index * 25;

      doc.setFont(undefined, "bold");
      doc.text(`P${index + 1}:`, leftCol, passengerY);
      doc.setFont(undefined, "normal");
      doc.text(
        `${passenger.fullName} | ${formatDate(passenger.dateOfBirth)} | ${
          passenger.nationality
        }`,
        leftCol + 15,
        passengerY
      );
      doc.text(
        `Passport: ${passenger.passportNumber}`,
        leftCol + 15,
        passengerY + 8
      );
    });

    // Contact Section
    currentY += passengerHeight + 10;
    drawSection(currentY, currentY + 15, "Contact");
    currentY += 10;

    doc.setFont(undefined, "bold");
    doc.text("Email:", leftCol, currentY);
    doc.text("Phone:", rightCol, currentY);

    doc.setFont(undefined, "normal");
    doc.text(booking.contactInfo.email, leftCol + 20, currentY);
    doc.text(
      booking.contactInfo.phoneNumber.toString(),
      rightCol + 20,
      currentY
    );

    // Booking Information
    currentY += 15;
    drawSection(currentY, currentY + 25, "Booking Information");

    currentY += 10;
    doc.setFont(undefined, "bold");
    doc.text("Date:", leftCol, currentY);
    doc.text("Status:", rightCol, currentY);

    doc.setFont(undefined, "normal");
    doc.text(formatDate(booking.bookingDate), leftCol + 20, currentY);
    doc.text(booking.bookingStatus, rightCol + 20, currentY);

    currentY += 8;
    doc.setFont(undefined, "bold");
    doc.text("Payment:", leftCol, currentY);

    const statusColors = {
      SUCCESS: [0, 128, 0],
      FAILED: [255, 0, 0],
      PENDING: [255, 140, 0],
    };
    const statusColor = statusColors[booking.paymentStatus] || [0, 0, 0];
    doc.setTextColor(...statusColor);
    doc.setFont(undefined, "normal");
    doc.text(booking.paymentStatus, leftCol + 25, currentY);
    doc.setTextColor(0, 0, 0);

    // Total amount
    doc.setFillColor(0, 87, 168);
    doc.setTextColor(255, 255, 255);
    doc.rect(rightCol - 5, currentY - 5, 70, 8, "F");
    doc.text(`Total: INR ${booking.totalAmount}`, rightCol, currentY);

    // QR Code
    const qrData = await QRCode.toDataURL(
      JSON.stringify({
        bookingId: booking._id,
        flightNumber: booking.flightId.segments[0]?.flightNumber,
        passengers: booking.passengers.map((p) => p.fullName),
      })
    );
    doc.addImage(qrData, "PNG", pageWidth - 50, currentY - 30, 30, 30);

    // Footer
    doc.setFillColor(0, 87, 168);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    centerText(
      "This is an electronically generated ticket. Valid with government-issued ID.",
      pageHeight - 4
    );

    return doc;
  } catch (error) {
    console.error("Error generating ticket:", error);
    throw new Error("Failed to generate ticket");
  }
};

export default ticketGenerator;
