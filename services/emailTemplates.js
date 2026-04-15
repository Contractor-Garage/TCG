function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildSeminarSignupEmail(data) {
    const {
        fullname = escapeHtml(fullname),
        email = escapeHtml(email),
        phoneNumber = escapeHtml(phoneNumber),
        attendanceType = escapeHtml(attendanceType),
        company = escapeHtml(company),
        jobTitle = escapeHtml(jobTitle),
        hearAboutUs = escapeHtml(hearAboutUs),
        specialRequests = escapeHtml(specialRequests),
    } = data;

    return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 { color: #333; }
        p { margin: 10px 0; color: #555; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Seminar Sign-Up</h2>
        <p><strong>Full Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Attendance Type:</strong> ${attendanceType}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
        <p><strong>How Did They Hear About Us:</strong> ${hearAboutUs}</p>
        <p><strong>Geographic Market:</strong> ${specialRequests}</p>

        <table>
          <tr><th>Field</th><th>Value</th></tr>
          <tr><td>Full Name</td><td>${fullname}</td></tr>
          <tr><td>Email</td><td>${email}</td></tr>
          <tr><td>Phone Number</td><td>${phoneNumber}</td></tr>
          <tr><td>Attendance Type</td><td>${attendanceType}</td></tr>
          <tr><td>Company</td><td>${company}</td></tr>
          <tr><td>Job Title</td><td>${jobTitle}</td></tr>
          <tr><td>How Did They Hear About Us</td><td>${hearAboutUs}</td></tr>
          <tr><td>Geographic Market</td><td>${specialRequests}</td></tr>
        </table>
      </div>
    </body>
  </html>
  `;
}

module.exports = { buildSeminarSignupEmail };
