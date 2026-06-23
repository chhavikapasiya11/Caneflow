const express = require("express");

const ProcurementSchedule =
require("../models/Procurement");

const auth =
require("../middleware/auth");

const authorize =
require("../middleware/role");

const router = express.Router();

/*
Create Schedule
*/
router.post(
"/",
auth,
authorize("mill"),
async (req, res) => {
try {

  const {
    serviceDate,
    capacity,
  } = req.body;

  if (
    !serviceDate ||
    !capacity
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Service date and capacity are required",
    });
  }

  const existing =
    await ProcurementSchedule.findOne({
      serviceDate,
    });

  if (existing) {
    return res.status(400).json({
      success: false,
      message:
        "Schedule already exists",
    });
  }

  const schedule =
    await ProcurementSchedule.create({
      serviceDate,
      capacity,
      allocated: 0,
    });

  res.status(201).json({
    success: true,
    data: schedule,
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
Get All Schedules
*/
router.get(
"/",
auth,
async (req, res) => {
try {

  const schedules =
    await ProcurementSchedule.find()
      .sort({
        serviceDate: 1,
      });

  res.status(200).json({
    success: true,
    data: schedules,
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
