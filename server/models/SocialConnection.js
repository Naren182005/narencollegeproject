const mongoose = require('mongoose');
const crypto = require('crypto');

// Environment variables for encryption
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secure-encryption-key-min-32-chars'; // In production, use env var
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || 'your-secure-iv-16'; // In production, use env var

// Encryption/decryption functions
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_IV, 'hex'));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_IV, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Schema for social media connections
const socialConnectionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube']
  },
  accessToken: {
    type: String,
    required: true,
    set: encrypt,
    get: decrypt
  },
  refreshToken: {
    type: String,
    set: function(token) {
      return token ? encrypt(token) : null;
    },
    get: function(token) {
      return token ? decrypt(token) : null;
    }
  },
  tokenExpiresAt: {
    type: Date
  },
  connectedAt: {
    type: Date,
    default: Date.now
  },
  accountUsername: {
    type: String,
    required: true
  },
  accountId: {
    type: String,
    required: true
  },
  accountName: {
    type: String
  },
  profilePictureUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { getters: true, setters: false },
  toObject: { getters: true, setters: false }
});

// Compound index to ensure a user can only connect one account per platform
socialConnectionSchema.index({ userId: 1, platform: 1, accountId: 1 }, { unique: true });

const SocialConnection = mongoose.model('SocialConnection', socialConnectionSchema);

module.exports = SocialConnection;
