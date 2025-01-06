const { rtpModel, globalRtpModel } = require("../models");
const { NORMAL_PROJECTION } = require("../utils/constants");

const rtpService = {};

rtpService.findOne = async (criteria, options) =>
  await rtpModel.findOne(criteria);
rtpService.create = async (payload) => await rtpModel.create(payload);
rtpService.updateOne = async (criteria, toUpdate) =>
  await rtpModel.updateOne(criteria, toUpdate);

rtpService.updateMany = async (criteria, toUpdate) =>
  await rtpModel.updateOne(criteria, toUpdate);


// Global RTP
rtpService.updateOneGlobal = async (criteria, toUpdate, options) =>
  await globalRtpModel.updateOne(criteria, toUpdate, options);
rtpService.findGlobal = async () => await globalRtpModel.find()

module.exports = rtpService;
