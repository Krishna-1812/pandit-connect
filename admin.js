// Admin dashboard script
document.addEventListener('DOMContentLoaded', () => {
  // Helper to format date/time
  function formatDate(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  // Populate bookings table
  const bookingsTableBody = document.querySelector('#bookings-table tbody');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  if (bookings.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    // We now have 9 columns in the bookings table (Name, Email, Phone, Service, Date, Location, Details, Payment, Submitted)
    cell.colSpan = 9;
    cell.textContent = 'No booking requests yet.';
    row.appendChild(cell);
    bookingsTableBody.appendChild(row);
  } else {
    bookings.forEach(booking => {
      const row = document.createElement('tr');
      // Extract payment method if available
      const paymentMethod = booking.payment && booking.payment.method ? booking.payment.method : '';
      // Create an array of booking values in the order of table columns
      const values = [
        booking.name,
        booking.email,
        booking.phone,
        booking.service,
        booking.date,
        booking.location,
        booking.details,
        paymentMethod,
        formatDate(booking.submitted)
      ];
      values.forEach(val => {
        const td = document.createElement('td');
        td.textContent = val || '-';
        row.appendChild(td);
      });
      bookingsTableBody.appendChild(row);
    });
  }

  // Populate messages table
  const messagesTableBody = document.querySelector('#messages-table tbody');
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  if (messages.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = 'No messages yet.';
    row.appendChild(cell);
    messagesTableBody.appendChild(row);
  } else {
    messages.forEach(msg => {
      const row = document.createElement('tr');
      [msg.name, msg.email, msg.subject, msg.message, formatDate(msg.submitted)]
        .forEach(val => {
          const td = document.createElement('td');
          td.textContent = val || '-';
          row.appendChild(td);
        });
      messagesTableBody.appendChild(row);
    });
  }

  // Clear data button
  const clearBtn = document.getElementById('clear-data-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all booking and message data?')) {
        localStorage.removeItem('bookings');
        localStorage.removeItem('messages');
        // Refresh page to update tables
        location.reload();
      }
    });
  }
});