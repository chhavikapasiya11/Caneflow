const express = require("express");
const QueueTicket = require("../models/QueueTicket");

const auth = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Queue Route Working",
  });
});

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

      // Today's date
      const today = new Date()
        .toISOString()
        .split("T")[0];

      // Find today's latest token
      const lastTicket = await QueueTicket.findOne({
        queueDate: today,
      }).sort({ tokenNumber: -1 });

      let nextTokenNumber = 1;

      if (lastTicket) {
        nextTokenNumber =
          lastTicket.tokenNumber + 1;
      }

      const ticket = await QueueTicket.create({
        tokenNumber: nextTokenNumber,
        queueDate: today,
        farmer: farmerId,
      });

      res.status(201).json({
        success: true,
        message: "Token generated successfully",
        data: {
          tokenNumber: ticket.tokenNumber,
          queueDate: ticket.queueDate,
          status: ticket.status,
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
router.get(
  "/my-status",
  auth,
  authorize("farmer"),
  async (req, res) => {
    try {

      const ticket =
        await QueueTicket.findOne({
          farmer: req.user.id,
        }).sort({ createdAt: -1 });

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "No active ticket found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          tokenNumber: ticket.tokenNumber,
          status: ticket.status,
          queueDate: ticket.queueDate,
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