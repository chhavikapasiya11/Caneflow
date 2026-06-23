const express = require("express");

const QueueTicket =
require("../models/QueueTicket");

const QueueState =
require("../models/QueueState");

const ProcurementSchedule =
require("../models/Procurement");

const auth =
require("../middleware/auth");

const authorize =
require("../middleware/role");

const router = express.Router();

/*
Mill Dashboard
*/
router.get(
"/mill",
auth,
authorize("mill"),
async (req, res) => {
try {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const schedule =
    await ProcurementSchedule.findOne({
      serviceDate: today,
    });

  const queueState =
    await QueueState.findOne({
      serviceDate: today,
    });

  const totalTokens =
    await QueueTicket.countDocuments({
      serviceDate: today,
    });

  const currentToken =
    queueState?.currentToken || 0;

  const remainingVehicles =
    Math.max(
      totalTokens -
      currentToken,
      0
    );

  res.status(200).json({
    success: true,
    data: {
      serviceDate: today,

      capacity:
        schedule?.capacity || 0,

      allocated:
        schedule?.allocated || 0,

      totalTokens,

      currentToken,

      remainingVehicles,
    },
  });

} catch (error) {

  console.error(error);

  res.status(500).json({
    success: false,
    message:
      "Internal Server Error",
  });

}

}
);

module.exports = router;
