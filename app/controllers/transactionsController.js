const { createSuccessResponse, createErrorResponse } = require("../helpers");
const { transactionService } = require("../services");
const CONSTANTS = require("../utils/constants");
const { MESSAGES, ERROR_TYPES, USER_ROLES } = require("../utils/constants");
const commonFunctions = require("../utils/utils");


const createTransaction = async (payload) => {
    const { user, userId, paymentType, amount, approved } = payload

    const transaction = await transactionService.create({
        userId: userId,
        paymentType: paymentType,
        amount: amount,
        approved: user.role === USER_ROLES.ADMIN || approved ? true : false,
    })


    if (transaction.approved) {
        await transactionService.updateWallet({ userId: userId }, {
            $set: {
                userId: userId,
                companyAccount: user.role === USER_ROLES.ADMIN ? true : false
            },
            $inc: {
                credits: amount
            }
        }, { upsert: true })

    }


    if (transaction) {
        return createSuccessResponse(MESSAGES.SUCCESS, transaction)
    }

    return createErrorResponse(MESSAGES.FAILURE, ERROR_TYPES.BAD_REQUEST, {})
}

const updateTransaction = async (payload) => {
    const { id, approved, userId, user } = payload

    const findTransaction = await transactionService.findOneTransaction({ _id: commonFunctions.convertIdToMongooseId(id) });
    const findWalletAdmin = await transactionService.findWallet({ userId: commonFunctions.convertIdToMongooseId(user._id) });


    if (findWalletAdmin.credits <= findTransaction.credits) {
        return createErrorResponse(MESSAGES.ADMIN_NEEDS_ADD_MONEY, ERROR_TYPES.BAD_REQUEST, {})

    }

    const transaction = await transactionService.findAndUpdateOne(
        { _id: commonFunctions.convertIdToMongooseId(id) },
        {
            $set: {
                approved: approved
            }
        }, { new: true });



    await transactionService.create({

        userId: user._id,
        paymentType: transaction.paymentType,
        amount: -transaction.amount,
        approved: true
    })





    await transactionService.updateWallet({ userId: userId }, {
        $set: {
            userId: userId,
            companyAccount: false
        },
        $inc: {
            credits: transaction.amount
        }
    }, { upsert: true });

    await transactionService.updateWallet({ userId: user._id }, {
        $set: {
            userId: user._id,
            companyAccount: true
        },
        $inc: {
            credits: -transaction.amount
        }
    }, { upsert: true })


    // Due date after 1 month
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + CONSTANTS.DEBT_DURATION);

    const debt = await transactionService.createDebt({
        userId: userId,
        fromAdmin: user._id,
        amount: transaction.amount,
        dueDate: dueDate,
        interestPercentage: CONSTANTS.INTEREST_RATE[1],
        settled: false
    })

    if (transaction) {
        return createSuccessResponse(MESSAGES.SUCCESS, transaction)
    }

    return createErrorResponse(MESSAGES.FAILURE, ERROR_TYPES.BAD_REQUEST, {})
}

const getWalletDetails = async (payload) => {
    const { userId } = payload
    const getWallet = await transactionService.findWallet({ userId: userId });

    if (getWallet) {
        return createSuccessResponse(MESSAGES.SUCCESS, getWallet)
    }

    return createErrorResponse(MESSAGES.FAILURE, ERROR_TYPES.BAD_REQUEST, {})
}

const getCreditsDetails = async (payload) => {
    const { user, index, limit } = payload;

    let criteria = {
        approved: false
    }

    if (user.role === USER_ROLES.USER) {
        criteria.userId = user._id
    }
    const details = await transactionService.findTransactions(criteria, index, limit);

    if (details.length) {
        return createSuccessResponse(MESSAGES.SUCCESS, details)
    }
    return createErrorResponse(MESSAGES.NO_CREDIT_REQ, ERROR_TYPES.BAD_REQUEST, [])
}

const getAllTransactions = async (payload) => {
    const { user, index, limit, userId, sortKey, sortDirection } = payload;

    const getTransactions = await transactionService.getAllTransactions(index, limit, userId, sortKey, sortDirection);


    if (getTransactions.length > 0) {
        return createSuccessResponse(MESSAGES.SUCCESS, getTransactions)
    }
    return createErrorResponse(MESSAGES.NO_TRANSACTION_FOUND, ERROR_TYPES.DATA_NOT_FOUND, {})

}


module.exports = { createTransaction, updateTransaction, getWalletDetails, getCreditsDetails, getAllTransactions }
