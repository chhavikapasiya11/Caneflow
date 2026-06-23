const mongoose = require("mongoose");

const queueTicketSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
    },

    serviceDate: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "QueueTicket",
  queueTicketSchema
);