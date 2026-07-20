const express = require("express");

const ProcurementSchedule =
require("../models/Procurement");

const auth =
require("../middleware/auth");

const authorize =
require("../middleware/role");
const QueueTicket =
require("../models/QueueTicket");

const QueueState =
require("../models/QueueState");

const getToday =
require("../utils/date");

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
/*
Cleanup Old Records
*/

router.delete(
    "/cleanup",
    auth,
    authorize("mill"),
    async (req, res) => {

        try {

            const getToday = require("../utils/date");

            const today = new Date(getToday());

            today.setDate(today.getDate() - 7);

            const cutoffDate =
                today.toISOString().split("T")[0];

            const oldSchedules =
                await ProcurementSchedule.find({
                    serviceDate: {
                        $lt: cutoffDate,
                    },
                });

            const dates =
                oldSchedules.map(
                    schedule => schedule.serviceDate
                );

            await ProcurementSchedule.deleteMany({
                serviceDate: {
                    $in: dates,
                },
            });

            await QueueTicket.deleteMany({
                serviceDate: {
                    $in: dates,
                },
            });

            await QueueState.deleteMany({
                serviceDate: {
                    $in: dates,
                },
            });

            res.status(200).json({
                success: true,
                message: `${dates.length} old schedule(s) cleaned.`,
            });

        }

        catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });

        }

    }
);
/*
Delete Schedule
*/

router.delete(
    "/:id",
    auth,
    authorize("mill"),
    async (req, res) => {

        try {

            const schedule =
                await ProcurementSchedule.findById(
                    req.params.id
                );

            if (!schedule) {

                return res.status(404).json({
                    success: false,
                    message: "Schedule not found",
                });

            }

            await ProcurementSchedule.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({
                success: true,
                message: "Schedule deleted successfully.",
            });

        }

        catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });

        }

    }
);

module.exports = router;
