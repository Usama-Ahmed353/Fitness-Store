const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Email Service - All email sending functionality
 * Uses SendGrid for reliable email delivery
 */

/**
 * Send welcome email to new user
 * @param {Object} user - User object with email, firstName
 */
exports.sendWelcomeEmail = async (user) => {
  try {
    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: 'Welcome to CrunchFit Pro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to CrunchFit Pro, ${user.firstName}!</h2>
          <p>Thank you for joining our fitness community.</p>
          <p>Your account has been successfully created and verified.</p>
          <h3>What's Next?</h3>
          <ul>
            <li>Complete your profile</li>
            <li>Browse and join gyms near you</li>
            <li>Book fitness classes</li>
            <li>Connect with trainers</li>
          </ul>
          <p>Start your fitness journey today!</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

/**
 * Send email verification link
 * @param {Object} user - User object
 * @param {string} verificationToken - Email verification token
 */
exports.sendEmailVerificationEmail = async (user, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Hi ${user.firstName},</p>
          <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
          <p>
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p>Or copy this link in your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Email verification sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending email verification:', error);
  }
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Password reset token
 */
exports.sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>Hi ${user.firstName},</p>
          <p>We received a request to reset your password. Click the link below to create a new password:</p>
          <p>
            <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>Or copy this link:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

/**
 * Send class booking confirmation
 * @param {Object} user - User object
 * @param {Object} classData - Class information
 */
exports.sendClassBookingConfirmationEmail = async (user, classData) => {
  try {
    const { className, instructorName, classDate, classTime, location } =
      classData;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: `Booking Confirmed: ${className}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Booking Confirmed!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your class booking has been confirmed.</p>
          <h3>Class Details</h3>
          <ul>
            <li><strong>Class:</strong> ${className}</li>
            <li><strong>Instructor:</strong> ${instructorName}</li>
            <li><strong>Date & Time:</strong> ${classDate} at ${classTime}</li>
            <li><strong>Location:</strong> ${location}</li>
          </ul>
          <p>Please arrive 10 minutes early. Thanks for booking!</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Class booking confirmation sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
  }
};

/**
 * Send class reminder (24 hours before)
 * @param {Object} user - User object
 * @param {Object} classData - Class information
 */
exports.sendClassReminderEmail = async (user, classData) => {
  try {
    const { className, instructorName, classDate, classTime, location } =
      classData;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: `Reminder: ${className} Tomorrow at ${classTime}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Class Reminder!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your class starts tomorrow! Don't miss it.</p>
          <h3>Class Details</h3>
          <ul>
            <li><strong>Class:</strong> ${className}</li>
            <li><strong>Instructor:</strong> ${instructorName}</li>
            <li><strong>Time:</strong> ${classTime}</li>
            <li><strong>Location:</strong> ${location}</li>
          </ul>
          <p>See you there!</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Class reminder sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending class reminder:', error);
  }
};

/**
 * Send payment receipt
 * @param {Object} user - User object
 * @param {Object} paymentData - Payment information
 */
exports.sendPaymentReceiptEmail = async (user, paymentData) => {
  try {
    const {
      invoiceId,
      transactionId,
      amount,
      date,
      type,
      description,
    } = paymentData;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: `Payment Receipt - ${amount.toFixed(2)} USD`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payment Receipt</h2>
          <p>Hi ${user.firstName},</p>
          <p>Thank you! Your payment has been processed successfully.</p>
          <h3>Receipt Details</h3>
          <ul>
            <li><strong>Amount:</strong> $${amount.toFixed(2)} USD</li>
            <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
            <li><strong>Type:</strong> ${type}</li>
            <li><strong>Transaction ID:</strong> ${transactionId || invoiceId}</li>
            ${description ? `<li><strong>Description:</strong> ${description}</li>` : ''}
          </ul>
          <p>Keep this receipt for your records.</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Payment receipt sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending payment receipt:', error);
  }
};

/**
 * Send payment failed notification
 * @param {Object} user - User object
 * @param {Object} paymentData - Payment information
 */
exports.sendPaymentFailedEmail = async (user, paymentData) => {
  try {
    const { invoiceId, transactionId, amount, reason, nextRetryDate } =
      paymentData;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: 'Payment Failed - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payment Failed</h2>
          <p>Hi ${user.firstName},</p>
          <p>We were unable to process your payment. Please update your payment method.</p>
          <h3>Payment Details</h3>
          <ul>
            <li><strong>Amount:</strong> $${amount.toFixed(2)} USD</li>
            <li><strong>Transaction ID:</strong> ${transactionId || invoiceId}</li>
            <li><strong>Reason:</strong> ${reason || 'Payment declined'}</li>
            ${nextRetryDate ? `<li><strong>Retry Date:</strong> ${new Date(nextRetryDate).toLocaleDateString()}</li>` : ''}
          </ul>
          <p>
            <a href="${process.env.FRONTEND_URL}/settings/billing" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Update Payment Method
            </a>
          </p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Payment failed notification sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending payment failed email:', error);
  }
};

/**
 * Send membership expiry warning (30 days before)
 * @param {Object} user - User object
 * @param {Object} membershipData - Membership information
 */
exports.sendMembershipExpiryWarningEmail = async (
  user,
  membershipData
) => {
  try {
    const { gymName, expiryDate, daysRemaining } = membershipData;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: `Your Membership Expires in ${daysRemaining} Days`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Membership Expiry Notice</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your membership at ${gymName} is expiring soon!</p>
          <h3>Membership Details</h3>
          <ul>
            <li><strong>Gym:</strong> ${gymName}</li>
            <li><strong>Expiry Date:</strong> ${new Date(expiryDate).toLocaleDateString()}</li>
            <li><strong>Days Remaining:</strong> ${daysRemaining}</li>
          </ul>
          <p>
            <a href="${process.env.FRONTEND_URL}/gyms" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Renew Membership
            </a>
          </p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Membership expiry warning sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending membership expiry warning:', error);
  }
};

/**
 * Send gym subscription invoice
 * @param {Object} user - User object
 * @param {Object} invoiceData - Invoice information
 */
exports.sendGymSubscriptionInvoiceEmail = async (user, invoiceData) => {
  try {
    const {
      gymName,
      plan,
      amount,
      invoiceDate,
      nextBillingDate,
      invoiceId,
    } = invoiceData;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: `Gym Subscription Invoice - ${gymName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Subscription Invoice</h2>
          <p>Hi ${user.firstName},</p>
          <p>Here's your gym subscription invoice for this billing period.</p>
          <h3>Invoice Details</h3>
          <ul>
            <li><strong>Gym:</strong> ${gymName}</li>
            <li><strong>Plan:</strong> ${plan}</li>
            <li><strong>Amount:</strong> $${amount.toFixed(2)} USD</li>
            <li><strong>Invoice Date:</strong> ${new Date(invoiceDate).toLocaleDateString()}</li>
            <li><strong>Next Billing:</strong> ${new Date(nextBillingDate).toLocaleDateString()}</li>
            <li><strong>Invoice ID:</strong> ${invoiceId}</li>
          </ul>
          <p>Thank you for your subscription!</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Gym subscription invoice sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending gym subscription invoice:', error);
  }
};

/**
 * Send membership cancellation confirmation
 * @param {Object} user - User object
 * @param {Object} cancelData - Cancellation information
 */
exports.sendCancellationConfirmationEmail = async (user, cancelData = {}) => {
  try {
    const { gymName = 'Your Gym' } = cancelData;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: 'Membership Cancelled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Membership Cancelled</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your membership at ${gymName} has been successfully cancelled.</p>
          <p>You will no longer be charged for this membership.</p>
          <h3>What to Know</h3>
          <ul>
            <li>You will lose access to the gym immediately</li>
            <li>You won't be refunded for the current billing period</li>
            <li>You can rejoin anytime from your dashboard</li>
          </ul>
          <p>We'd love to have you back someday!</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Cancellation confirmation sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending cancellation confirmation:', error);
  }
};

/**
 * Send trainer booking confirmation
 * @param {Object} user - User object
 * @param {Object} trainerData - Trainer session information
 */
exports.sendTrainerBookingConfirmationEmail = async (
  user,
  trainerData
) => {
  try {
    const { trainerName, sessionDate, sessionTime, duration, cost } =
      trainerData;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@crunchfitpro.com',
      subject: `Personal Training Session Confirmed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>PT Session Confirmed!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your personal training session has been booked.</p>
          <h3>Session Details</h3>
          <ul>
            <li><strong>Trainer:</strong> ${trainerName}</li>
            <li><strong>Date & Time:</strong> ${sessionDate} at ${sessionTime}</li>
            <li><strong>Duration:</strong> ${duration} minutes</li>
            <li><strong>Cost:</strong> $${cost.toFixed(2)} USD</li>
          </ul>
          <p>Get ready for an amazing session!</p>
          <p>Best regards,<br>CrunchFit Pro Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Trainer booking confirmation sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending trainer booking confirmation:', error);
  }
};
