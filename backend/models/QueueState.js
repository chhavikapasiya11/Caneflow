const mongoose = require("mongoose");

const queueStateSchema = new mongoose.Schema(
  {
    serviceDate: {
      type: String,
      required: true,
      unique: true,
    },

    currentToken: {
      type: Number,
      default: 0,
    },

    averageProcessingMinutes: {
      type: Number,
      default: 5,
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "QueueState",
  queueStateSchema
);