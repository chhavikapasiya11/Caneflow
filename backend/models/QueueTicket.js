const mongoose = require("mongoose");

const queueTicketSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
    },

    queueDate: {
      type: String,
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "processing",
        "completed",
      ],
      default: "waiting",
    },

    estimatedArrivalTime: {
      type: Date,
      default: null,
    },

    estimatedArrivalMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "QueueTicket",
  queueTicketSchema
);