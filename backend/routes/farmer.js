const express = require("express");

const User = require("../models/User");
const QueueTicket = require("../models/QueueTicket");

const auth = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

/*
Get Farmers Eligible For Token
*/

router.get(
  "/",
  auth,
  authorize("mill"),
  async (req, res) => {
    try {

      // Farmers having active tokens

      const activeTickets =
        await QueueTicket.find({
          status: {
            $in: [
              "waiting",
              "processing",
            ],
          },
        }).select("farmer");

      const allocatedFarmerIds =
        activeTickets.map(
          (ticket) =>
            ticket.farmer.toString()
        );

      // Farmers without active tokens
const farmers =
  await User.find({
    role: "farmer",

    _id: {
      $nin: allocatedFarmerIds,
    },
  })
    .select("name phone createdAt")
    .sort({
      createdAt: 1,
    });

      res.status(200).json({
        success: true,
        count: farmers.length,
        data: farmers,
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