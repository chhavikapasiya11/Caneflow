const express = require("express");

const QueueState =
require("../models/QueueState");

const auth =
require("../middleware/auth");

const authorize =
require("../middleware/role");

const router = express.Router();
/*
Update Current Token Manually
*/
router.patch(
"/current-token",
auth,
authorize("mill"),
async (req, res) => {
try {

  const { currentToken } =
    req.body;

  if (
    currentToken === undefined
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Current token is required",
    });
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const state =
    await QueueState.findOneAndUpdate(
      {
        serviceDate: today,
      },
      {
        currentToken,
        lastUpdatedAt:
          new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

  res.status(200).json({
    success: true,
    data: state,
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

//Move To Next Vehicle

router.post(
"/next",
auth,
authorize("mill"),
async (req, res) => {
try {

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const totalTokens =
    await QueueTicket.countDocuments({
      serviceDate: today,
    });

  if (totalTokens === 0) {
    return res.status(400).json({
      success: false,
      message:
        "No vehicles scheduled for today",
    });
  }

  let state =
    await QueueState.findOne({
      serviceDate: today,
    });

  if (!state) {

    state =
      await QueueState.create({
        serviceDate: today,
        currentToken: 1,
        averageProcessingMinutes: 5,
      });

      return res.status(200).json({
        success: true,
        message:
          "Moved to next vehicle",
        data: {
          currentToken:
            state.currentToken,
        },
      });

  }

  if (
    state.currentToken >=
    totalTokens
  ) {
    return res.status(400).json({
      success: false,
      message:
        "No more vehicles in queue",
    });
  }

  state.currentToken += 1;

  state.lastUpdatedAt =
    new Date();

  await state.save();

  res.status(200).json({
    success: true,
    message:
      "Moved to next vehicle",
    data: {
      currentToken:
        state.currentToken,
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
