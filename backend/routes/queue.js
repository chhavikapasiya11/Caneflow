const express = require("express");

const QueueTicket = require("../models/QueueTicket");
const QueueState = require("../models/QueueState");

const auth = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

/*
  Generate Token
*/
router.post(
"/",
auth,
authorize("mill"),
async (req, res) => {
try {

  const { farmerId } = req.body;

  if (!farmerId) {
    return res.status(400).json({
      success: false,
      message: "Farmer ID is required",
    });
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const lastTicket =
    await QueueTicket.findOne({
      queueDate: today,
    }).sort({
      tokenNumber: -1,
    });

  const nextTokenNumber =
    lastTicket
      ? lastTicket.tokenNumber + 1
      : 1;

  const queueState =
    await QueueState.findOne({
      queueDate: today,
    });

  const dailyCapacity =
    queueState?.dailyCapacity || 200;

  const dayOffset =
    Math.floor(
      (nextTokenNumber - 1) /
      dailyCapacity
    );

  const serviceDate =
    new Date();

  serviceDate.setDate(
    serviceDate.getDate() +
    dayOffset
  );

  const formattedServiceDate =
    serviceDate
      .toISOString()
      .split("T")[0];

  const ticket =
    await QueueTicket.create({
      tokenNumber:
        nextTokenNumber,

      queueDate:
        today,

      serviceDate:
        formattedServiceDate,

      farmer:
        farmerId,
    });

  res.status(201).json({
    success: true,
    message:
      "Token generated successfully",
    data: {
      tokenNumber:
        ticket.tokenNumber,

      queueDate:
        ticket.queueDate,

      serviceDate:
        ticket.serviceDate,

      status:
        ticket.status,
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
/*
  Farmer Queue Status
*/
router.get(
"/my-status",
auth,
authorize("farmer"),
async (req, res) => {
try {
  const ticket =
    await QueueTicket.findOne({
      farmer: req.user.id,
    }).sort({
      createdAt: -1,
    });

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "No active ticket found",
    });
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  if (ticket.serviceDate !== today) {

    return res.status(200).json({
      success: true,
      data: {
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
      queueDate: today,
    });

  const currentToken =
    queueState?.currentToken || 0;

  const avgProcessingMinutes =
    queueState?.averageProcessingMinutes || 5;

  const ahead = Math.max(
    ticket.tokenNumber -
    currentToken - 1,
    0
  );

  const etaMinutes =
    ahead *
    avgProcessingMinutes;

  const windowStart =
    new Date(
      Date.now() +
      etaMinutes * 60 * 1000
    );

  const windowEnd =
    new Date(
      windowStart.getTime() +
      30 * 60 * 1000
    );

  const arrivalWindow =
    `${windowStart.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    )} - ${windowEnd.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    )}`;

  let message = "";

  if (currentToken === 0) {
    message =
      "Queue has not started yet";
  } else if (ahead === 0) {
    message =
      "Your turn has arrived. Please proceed to the mill";
  } else {
    message =
      `${ahead} vehicle(s) ahead of you`;
  }
  res.status(200).json({
    success: true,
    data: {
      tokenNumber:
        ticket.tokenNumber,

      serviceDate:
        ticket.serviceDate,

      currentToken,

      ahead,

      arrivalWindow,

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