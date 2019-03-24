const express = require('express')
const Schedule = require('../controllers/schedule');
const validateToken = require('../utils').validateToken;

const ScheduleRouter = express.Router();

ScheduleRouter.route("/exist").get(validateToken, Schedule.exist);
ScheduleRouter.route("/getBy").get(validateToken, Schedule.getBy);
ScheduleRouter.route("/add").post(validateToken, Schedule.add);
ScheduleRouter.route("/update").post(validateToken, Schedule.update);
ScheduleRouter.route("/updatefrom").post(validateToken, Schedule.updatefrom);

module.exports = ScheduleRouter;
