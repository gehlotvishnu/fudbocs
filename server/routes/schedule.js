const express = require('express')
const Schedule = require('../controllers/schedule');
const validateToken = require('../utils').validateToken;

const ScheduleRouter = express.Router();

ScheduleRouter.route("/exist").get(validateToken, Schedule.exist);
ScheduleRouter.route("/getBy").get(validateToken, Schedule.getBy);
ScheduleRouter.route("/getScheduleQtyAmount").get(validateToken, Schedule.getScheduleQtyAmount);
ScheduleRouter.route("/add").post(validateToken, Schedule.add);
ScheduleRouter.route("/update").post(validateToken, Schedule.update);
ScheduleRouter.route("/updatefrom").post(validateToken, Schedule.updatefrom);
ScheduleRouter.route("/existmonth").get(validateToken, Schedule.ScheduleExistforMonth);

module.exports = ScheduleRouter;
