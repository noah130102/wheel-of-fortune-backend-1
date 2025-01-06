const { createSuccessResponse, createErrorResponse } = require("../helpers");
const rtpService = require("../services/rtpService");
const { MESSAGES, ERROR_TYPES } = require("../utils/constants");
const { BAD_REQUEST, FAILURE } = require("../utils/messages");


const setGlobalRtp = async (payload) => {

    const { rtpPercentage } = payload;

    let condition = {
        $set: {
            globalRtp: false
        }
    }

    if (rtpPercentage) {
        condition = {
            $set: {
                globalRtpPercentage: rtpPercentage,
                globalRtp: true

            }
        }
    }

    const res = await rtpService.updateOneGlobal({}, condition, { upsert: true })

    if (!res) {
        return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {})
    }
    return createSuccessResponse(MESSAGES.SET_GLOBAL_RTP, res);
}

const setUserRtp = async (payload) => {
    const { usersId, rtpPercentage } = payload;

    const res = await rtpService.updateMany(
        { userId: usersId },
        {
            $set: { rtpPercentage: rtpPercentage, globalRtp: false }
        })
    if (!res) {
        return createErrorResponse(BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, {})
    }
    return createSuccessResponse(MESSAGES.SUCCESS, res);

}

const getGlobalRtp = async (payload) => {
    const findGlobalRtp = await rtpService.findGlobal();


    if (findGlobalRtp.length) {
        return createSuccessResponse(MESSAGES.SUCCESS, findGlobalRtp[0])
    }
    return createErrorResponse(FAILURE, ERROR_TYPES.BAD_REQUEST, {})
}


module.exports = {
    setGlobalRtp,
    setUserRtp,
    getGlobalRtp
}