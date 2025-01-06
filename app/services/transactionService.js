'use strict';

const { transactionModel, walletModel, debtModel } = require('../models');
const { convertIdToMongooseId } = require('../utils/utils');

const transactionService = {};


transactionService.create = async (payload) => await transactionModel.create(payload);
transactionService.findAndUpdateOne = async (criteria, toUpdate, options) =>
    await transactionModel.findOneAndUpdate(criteria, toUpdate, options);

transactionService.findOneTransaction = async (criteria) => await transactionModel.findOne(criteria);
transactionService.findTransactions = async (criteria, index, limit) =>
    await transactionModel.find(criteria)
        .sort({ createdAt: -1 })
        .skip(index)
        .limit(limit);
transactionService.getAllTransactions = async (index, limit, userId, sortKey, sortDirection) => {
    return await transactionModel.aggregate([
        {
            $match: {
                ...(userId ? { userId: convertIdToMongooseId(userId) } : {})
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { userId: { $toString: "$userId" } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$userId", { $toString: "$_id" }]
                            }
                        }
                    },
                    {
                        $project: {
                            password: 0,
                        }
                    }
                ],
                as: 'user'
            }
        },
        {
            $unwind: {
                path: "$user",
            }
        },
        {
            $facet: {
                data: [
                    {
                        $sort: {
                            ...((sortKey && sortDirection) ? { [sortKey]: (Number(sortDirection) === 1 ? 1 : -1) } : { createdAt: -1 })
                        }
                    },
                    {
                        $skip: index
                    },
                    {
                        $limit: limit
                    }
                ],
                count: [
                    {
                        $count: "count"
                    }
                ]
            }
        },

    ])
}

// Wallet Operations
transactionService.createWallet = async (payload) => await walletModel.create(payload)
transactionService.updateWallet = async (criteria, toUpdate, options) =>
    await walletModel.findOneAndUpdate(criteria, toUpdate, options);

transactionService.findWallet = async (criteria) =>
    await walletModel.findOne(criteria);

transactionService.findAllWallets = async (criteria) =>
    await walletModel.find(criteria);



// Debt Operation
transactionService.createDebt = async (payload) => await debtModel.create(payload);


module.exports = transactionService