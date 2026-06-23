const mongoose = require("mongoose");

const procurementScheduleSchema =
  new mongoose.Schema(
    {
      serviceDate: {
        type: String,
        required: true,
        unique: true,
      },

      capacity: {
        type: Number,
        required: true,
      },

      allocated: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "ProcurementSchedule",
  procurementScheduleSchema
);