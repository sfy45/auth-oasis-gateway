
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Set CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Email template for notifications
const createEmailTemplate = (type: string, data: any) => {
  switch (type) {
    case "update":
      return {
        subject: "New Update from IRMAI",
        html: `
          <h1>New Update from IRMAI</h1>
          <p>Hello,</p>
          <p>We have a new update for you:</p>
          <p>${data.message}</p>
          <p>Thank you for subscribing to IRMAI updates.</p>
          <p>Best regards,<br>IRMAI Team</p>
        `,
      };
    case "welcome":
      return {
        subject: "Welcome to IRMAI",
        html: `
          <h1>Welcome to IRMAI</h1>
          <p>Hello ${data.email},</p>
          <p>Thank you for registering with IRMAI - your Intelligent Risk Management AI platform.</p>
          <p>We're excited to have you on board. Click the verification link in your other email to get started.</p>
          <p>Best regards,<br>IRMAI Team</p>
        `,
      };
    case "login":
      return {
        subject: "Login Confirmation - IRMAI",
        html: `
          <h1>Login Confirmation</h1>
          <p>Hello ${data.email},</p>
          <p>We are confirming that you have successfully logged into your IRMAI account.</p>
          <p>You will soon be redirected to your dashboard at <a href="http://34.45.239.136:8501/">http://34.45.239.136:8501/</a>.</p>
          <p>If you did not initiate this login, please secure your account immediately by changing your password.</p>
          <p>Best regards,<br>IRMAI Team</p>
        `,
      };
    case "magic-link":
      return {
        subject: "Magic Link Confirmation - IRMAI",
        html: `
          <h1>Magic Link Confirmation</h1>
          <p>Hello ${data.email},</p>
          <p>We've sent you a magic link to log in to your IRMAI account.</p>
          <p>Please check your inbox for the login link which will redirect you to <a href="http://34.45.239.136:8501/">http://34.45.239.136:8501/</a>.</p>
          <p>If you did not request this login method, please ignore this email or contact our support team.</p>
          <p>Best regards,<br>IRMAI Team</p>
        `,
      };
    case "password-reset":
      return {
        subject: "Password Reset Request - IRMAI",
        html: `
          <h1>Password Reset Request</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password for your IRMAI account. Click on the link in your other email to reset your password.</p>
          <p>After resetting your password, you will be redirected to <a href="http://34.45.239.136:8501/">http://34.45.239.136:8501/</a>.</p>
          <p>If you did not request this change, please contact our support team immediately.</p>
          <p>Best regards,<br>IRMAI Team</p>
        `,
      };
    case "subscription":
      return {
        subject: "Subscription Confirmation - IRMAI",
        html: `
          <h1>Subscription Confirmation</h1>
          <p>Hello,</p>
          <p>Thank you for subscribing to updates from IRMAI. You'll now receive notifications about new features, updates, and important announcements.</p>
          <p>Best regards,<br>IRMAI Team</p>
        `,
      };
    default:
      return {
        subject: "Notification from IRMAI",
        html: `
          <h1>Notification from IRMAI</h1>
          <p>Hello,</p>
          <p>${data.message || "This is a notification from IRMAI."}</p>
          <p>Best regards,<br>IRMAI Team</p>
        `,
      };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { type, recipients, data } = await req.json();
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error("Recipients array is required");
    }

    const template = createEmailTemplate(type, data);
    
    const emailPromises = recipients.map(recipient => 
      resend.emails.send({
        from: "IRMAI <IRMAI-info@irmai.io>",
        to: [recipient.email],
        subject: template.subject,
        html: template.html,
      })
    );

    const results = await Promise.all(emailPromises);
    
    console.log("Email sending results:", results);

    return new Response(
      JSON.stringify({ success: true, message: `Sent emails to ${recipients.length} recipients` }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
