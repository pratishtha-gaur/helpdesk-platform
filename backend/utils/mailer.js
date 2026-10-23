import axios from "axios";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// Stops user-typed text from injecting HTML into our emails.
function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Shared look for every email (navy header, gold accent).
function layout(title, bodyHtml) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
    <div style="background:#0a1128;padding:18px 24px;border-bottom:4px solid #f5a623">
      <h2 style="margin:0;color:#ffffff;font-size:18px">MAIT Student Helpdesk</h2>
    </div>
    <div style="padding:24px;color:#0f172a;font-size:14.5px;line-height:1.6">
      <h3 style="margin-top:0;color:#0a1128">${title}</h3>
      ${bodyHtml}
    </div>
    <div style="background:#f1f5f9;padding:14px 24px;font-size:12px;color:#64748b">
      Maharaja Agrasen Institute of Technology, Sector-22, Rohini, Delhi-110086.<br/>
      This is an automated message. Please do not reply to this email.
    </div>
  </div>`;
}

export async function sendMail({ to, subject, html }) {
  if (!process.env.BREVO_API_KEY || !process.env.MAIL_FROM_EMAIL) {
    console.warn(
      "Brevo not configured (BREVO_API_KEY / MAIL_FROM_EMAIL missing) - skipping email.",
    );
    return;
  }

  try {
    await axios.post(
      BREVO_URL,
      {
        sender: {
          name: process.env.MAIL_FROM_NAME || "MAIT Student Helpdesk",
          email: process.env.MAIL_FROM_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      },
    );
  } catch (err) {
    // Brevo explains what went wrong in err.response.data.message
    const reason = err.response?.data?.message || err.message;
    throw new Error(`Brevo send failed: ${reason}`);
  }
}

export function sendTicketCreatedEmail(ticket) {
  const link = `${process.env.FRONTEND_URL || "http://localhost:3000"}/track?code=${ticket.ticketCode}`;
  const html = layout(
    "We have received your request",
    `<p>Dear Student,</p>
     <p>Your request has been registered successfully. Our staff will review it within 24-48 working hours.</p>
     <table style="margin:16px 0;font-size:14px">
       <tr><td style="padding:4px 16px 4px 0;color:#64748b">Ticket ID</td><td><strong>${esc(ticket.ticketCode)}</strong></td></tr>
       <tr><td style="padding:4px 16px 4px 0;color:#64748b">Category</td><td>${esc(ticket.category)}</td></tr>
       <tr><td style="padding:4px 16px 4px 0;color:#64748b">Subject</td><td>${esc(ticket.subject)}</td></tr>
     </table>
     <p>Keep your Ticket ID safe. You can track progress anytime:</p>
     <p><a href="${link}" style="background:#f5a623;color:#0a1128;padding:10px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Track My Request</a></p>`,
  );
  return sendMail({
    to: ticket.email,
    subject: `[${ticket.ticketCode}] Your request has been received`,
    html,
  });
}

export function sendTicketResolvedEmail(ticket, staffReply) {
  const link = `${process.env.FRONTEND_URL || "http://localhost:3000"}/track?code=${ticket.ticketCode}`;
  const html = layout(
    "Your request has been resolved",
    `<p>Dear Student,</p>
     <p>Your request <strong>${esc(ticket.ticketCode)}</strong> (${esc(ticket.subject)}) has been marked as <strong style="color:#059669">Resolved</strong>.</p>
     <p style="margin-bottom:6px;color:#64748b">Response from MAIT staff:</p>
     <div style="background:#f4f7fe;border-left:4px solid #0a1128;padding:12px 16px;border-radius:6px;white-space:pre-wrap">${esc(staffReply)}</div>
     <p style="margin-top:18px">If you still need help, you can raise a new request or view the full history here:</p>
     <p><a href="${link}" style="background:#0a1128;color:#ffffff;padding:10px 20px;border-radius:999px;text-decoration:none;font-weight:bold">View Ticket</a></p>`,
  );
  return sendMail({
    to: ticket.email,
    subject: `[${ticket.ticketCode}] Your request has been resolved`,
    html,
  });
}
