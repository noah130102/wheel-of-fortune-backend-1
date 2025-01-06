const { gameModel } = require("../models");

const gameService = {};

gameService.getGames = async (userId, wheelId) => {
  return await gameModel.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $eq: ["$userId", userId] }, { $eq: ["$wheelId", wheelId] }],
        },
      },
    },
    {
      $group: {
        _id: null,
        betAmount: { $sum: "$betAmount" },
        outcomeAmount: { $sum: "$outcomeAmount" },
        userId: { $first: "$userId" },
        wheelId: { $first: "$wheelId" },
      },
    },
    {
      $addFields: {
        winPercentage: {
          $cond: {
            if: { $gte: ["$outcomeAmount", "$betAmount"] }, // If outcomeAmount >= betAmount, it's a win
            then: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$outcomeAmount", "$betAmount"] },
                    "$betAmount",
                  ],
                },
                100,
              ],
            },
            else: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$betAmount", "$outcomeAmount"] },
                    "$betAmount",
                  ],
                },
                -100, // Negative percentage to indicate a loss
              ],
            },
          },
        },
        rtp: {
          $multiply: [{ $divide: ["$outcomeAmount", "$betAmount"] }, 100], // RTP formula: (outcomeAmount / betAmount) * 100
        },
      },
    },
  ]);
};

gameService.createGame = async (payload) => await gameModel.create(payload);

gameService.getAdminGameDetails = async (payload) =>
  await gameModel.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: "$winLossStatus",
        betAmount: { $sum: "$betAmount" },
        count: { $sum: 1 },
        outcomeAmount: { $sum: "$outcomeAmount" },
      },
    },
    {
      $facet: {
        total: [
          {
            $group: {
              _id: null,
              betAmount: { $sum: "$betAmount" },
              outcomeAmount: { $sum: "$outcomeAmount" },
            },
          },
        ],
        winOrLoss: [],
      },
    },
  ]);

module.exports = gameService;
