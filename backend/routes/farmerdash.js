const express = require("express");

const QueueTicket =
require("../models/QueueTicket");

const QueueState =
require("../models/QueueState");

const auth =
require("../middleware/auth");

const authorize =
require("../middleware/role");

const router = express.Router();

/*
Farmer Dashboard
*/
router.get(
"/",
auth,
authorize("farmer"),
async (req, res) => {
try {

  const ticket =
    await QueueTicket.findOne({
      farmer: req.user.id,
    })
    .populate(
      "farmer",
      "name"
    )
    .sort({
      createdAt: -1,
    });

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message:
        "No active ticket found",
    });
  }

 const getToday = require("../utils/date");

const today = getToday();

  if (
    ticket.serviceDate !==
    today
  ) {

    return res.status(200).json({
      success: true,
      data: {
        farmerName:
          ticket.farmer?.name,

        tokenNumber:
          ticket.tokenNumber,

        serviceDate:
          ticket.serviceDate,

        status:
          ticket.status,

        message:
          "Your service date has not arrived yet",
      },
    });

  }

  const queueState =
    await QueueState.findOne({
      serviceDate: today,
    });

  const currentToken =
    queueState?.currentToken || 0;

  const avgProcessingMinutes =
    queueState?.averageProcessingMinutes || 5;

  const ahead = currentToken >= ticket.tokenNumber
    ? 0
    : ticket.tokenNumber - currentToken - 1;

  const etaMinutes =
    ahead *
    avgProcessingMinutes;

  let message = "";

if (currentToken === 0) {

    message = "Queue has not started yet";

}
else if (currentToken > ticket.tokenNumber) {

    message = "Your turn has already passed.";

}
else if (currentToken === ticket.tokenNumber) {

    message = "Your turn has arrived. Please proceed to the mill";

}
else {

    message = `${ahead} vehicle(s) ahead of you`;

}

  res.status(200).json({
    success: true,
    data: {
      farmerName:
        ticket.farmer?.name,

      tokenNumber:
        ticket.tokenNumber,

      serviceDate:
        ticket.serviceDate,

      currentToken,

      ahead,

      etaMinutes,

      status:
        ticket.status,

      message,
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
