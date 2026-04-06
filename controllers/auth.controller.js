const User = require('../models/User');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

let smtpTransporter;

const isUsableSendGridKey = () => {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  if (!key.startsWith('SG.')) return false;
  if (key.includes('your_sendgrid_api_key_here')) return false;
  return true;
};

const hasSmtpConfig = () => {
  const hasService =
    process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS;
  const hasHost =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;
  return Boolean(hasService || hasHost);
};

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'member',
    });

    // Generate email verification token
    const emailToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const verificationUrl = `${getFrontendUrl()}/verify-email?token=${encodeURIComponent(emailToken)}&email=${encodeURIComponent(user.email)}`;
    let emailSent = false;
    let emailError = null;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your CrunchFit Account',
        message: `Please verify your email by clicking this link: ${verificationUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email</h2>
            <p>Hi ${user.firstName},</p>
            <p>Thanks for signing up. Please verify your email by clicking the button below:</p>
            <p>
              <a href="${verificationUrl}" style="background:#0ea5a8;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">
                Verify Email
              </a>
            </p>
            <p>Or open this link:</p>
            <p style="word-break: break-all;">${verificationUrl}</p>
          </div>
        `,
      });
      emailSent = true;
    } catch (err) {
      emailError = err.message;
      console.error('Verification email send failed:', err.message);
    }

    // Return response with tokens
    const accessToken = user.generateJWT();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({
      success: true,
      message: emailSent
        ? 'User registered successfully. Please verify your email.'
        : 'User registered, but verification email could not be sent. Please contact support or configure email settings.',
      accessToken,
      refreshToken,
      emailSent,
      emailError,
      verificationUrl: process.env.NODE_ENV === 'development' ? verificationUrl : undefined,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Match password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create tokens
    const accessToken = user.generateJWT();
    const refreshToken = user.generateRefreshToken();

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    };

    res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided',
      });
    }

    const decoded = require('jsonwebtoken').verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    const newToken = user.generateJWT();
    const newRefreshToken = user.generateRefreshToken();

    res.status(200).json({
      success: true,
      accessToken: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token || req.query.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+emailVerificationToken');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token or user not found',
      });
    }

    // Idempotent success: if the account is already verified, treat repeated
    // verification attempts as successful instead of failing.
    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email already verified',
      });
    }

    if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token',
      });
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${getFrontendUrl()}/reset-password?token=${encodeURIComponent(resetToken)}`;
    let emailSent = false;
    let emailError = null;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        message: `Click here to reset your password: ${resetUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset</h2>
            <p>Hi ${user.firstName},</p>
            <p>Click below to reset your password:</p>
            <p>
              <a href="${resetUrl}" style="background:#0f4c81;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">
                Reset Password
              </a>
            </p>
            <p>Or open this link:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
          </div>
        `,
      });
      emailSent = true;
    } catch (err) {
      emailError = err.message;
      console.error('Password reset email failed:', err.message);
    }

    res.status(200).json({
      success: true,
      message: emailSent
        ? 'Password reset link sent to email'
        : 'Password reset requested, but email could not be sent.',
      emailSent,
      emailError,
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token || req.query.token;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required',
      });
    }

    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+passwordResetToken');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token or user not found',
      });
    }

    if (!user.passwordResetToken || user.passwordResetToken !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token',
      });
    }

    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired',
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update current user profile/settings
// @route   PATCH /api/auth/me
// @access  Private
exports.updateMe = async (req, res) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'profilePhoto',
      'notificationSettings',
      'preferences',
      'privacy',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (typeof req.body[field] !== 'undefined') {
        updates[field] = req.body[field];
      }
    }

    if (req.body.email && req.body.email !== '') {
      const existing = await User.findOne({ email: req.body.email.toLowerCase() });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(400).json({ success: false, message: 'Email is already in use' });
      }
      updates.email = req.body.email.toLowerCase();
      updates.isEmailVerified = false;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken');

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to send email
const sendEmail = async ({ email, subject, message, html }) => {
  if (isUsableSendGridKey()) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: email,
      from: process.env.EMAIL_FROM,
      subject,
      text: message,
      html: html || `<p>${message}</p>`,
    });
    return;
  }

  if (hasSmtpConfig()) {
    if (!smtpTransporter) {
      smtpTransporter = nodemailer.createTransport(
        process.env.SMTP_HOST
          ? {
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT),
              secure: Number(process.env.SMTP_PORT) === 465,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            }
          : {
              service: process.env.EMAIL_SERVICE,
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            }
      );
    }

    await smtpTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      text: message,
      html,
    });
    return;
  }

  throw new Error(
    'Email provider is not configured. Set SENDGRID_API_KEY or SMTP/EMAIL credentials in .env.'
  );
};
