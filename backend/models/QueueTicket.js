const mongoose = require("mongoose");

const queueTicketSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
    },

   queueDate: {
  type: String,
  required: true
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
        "called",
        "processing",
        "completed",
      ],
      default: "waiting",
    },

    estimatedArrivalTime: {
      type: Date,
      default: null,
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