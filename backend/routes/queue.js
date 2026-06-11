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

      const ticket =
        await QueueTicket.create({
          tokenNumber: nextTokenNumber,
          queueDate: today,
          farmer: farmerId,
        });

      res.status(201).json({
        success: true,
        message: "Token generated successfully",
        data: ticket,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
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
        currentToken,
        0
      );

      const etaMinutes =
        ahead *
        avgProcessingMinutes;

      res.status(200).json({
        success: true,
        data: {
          tokenNumber:
            ticket.tokenNumber,

          currentToken,

          ahead,

          etaMinutes,

          status:
            ticket.status,
        },
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });

    }
  }
);

module.exports = router;