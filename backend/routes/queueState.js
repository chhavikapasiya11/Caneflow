const express = require("express");

const QueueState =
  require("../models/QueueState");

const auth =
  require("../middleware/auth");

const authorize =
  require("../middleware/role");

const router = express.Router();

/*
  Update Current Token
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
            queueDate: today,
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

/*
  Get Queue State
*/
router.get(
  "/",
  auth,
  async (req, res) => {
    try {

      const today = new Date()
        .toISOString()
        .split("T")[0];

      const state =
        await QueueState.findOne({
          queueDate: today,
        });

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

module.exports = router;