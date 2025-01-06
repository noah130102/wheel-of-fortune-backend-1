const { createSuccessResponse, createErrorResponse } = require("../helpers");
const { wheelService, rtpService, transactionService } = require("../services");
const gameService = require("../services/gameService");
const { getGames } = require("../services/gameService");
const CONSTANTS = require("../utils/constants");
const { SUCCESS, PAYMENT_NOT_PROCESSED } = require("../utils/messages");
const commonFunctions = require("../utils/utils");
const { convertIdToMongooseId } = require("../utils/utils");

const spinTheWheel = async (payload) => {
  var { wheelId, user, betAmount, retryCounter } = payload;

  const userId = user._id;
  // user outcome to return
  let userOutcome = [];
  let userReward = 0;

  // find wheel and find symbols with it
  const findWheel = await wheelService.aggregateWithSymbols(
    convertIdToMongooseId(wheelId)
  );

  // find user rtp
  let findRtpOfUser = await rtpService.findOne({
    userId: convertIdToMongooseId(userId),
    wheelId: convertIdToMongooseId(wheelId),
  });

  //  calculate the outcome
  userOutcome = userOutcome.concat(handleSymbol(findWheel[0]?.symbols[0]));
  if (userOutcome[0].symbolsType === CONSTANTS.ARROW_SYMBOLS.ARROW_SYMBOL) {
    userOutcome = userOutcome.concat(handleSymbol(findWheel[0]?.symbols[1]));
    if (userOutcome[1].symbolsType === CONSTANTS.ARROW_SYMBOLS.ARROW_SYMBOL) {
      userOutcome.push({
        _id: convertIdToMongooseId("66f3c9a613f66564d40dc46b"),
        amountPayout: 10,
        deleted: false,
        description: '',
        image: '',
        name: '',
        probability: 0,
        symbolsType: 2,
      });
    }
  }

  // if win then positive if loss than negative
  if (userOutcome[userOutcome.length - 1].amountPayout * betAmount < betAmount) {
    userReward = -userOutcome[userOutcome.length - 1].amountPayout * betAmount;
  } else {
    userReward = userOutcome[userOutcome.length - 1].amountPayout * betAmount;
  }

  // if rtp does'nt exists then create
  if (!findRtpOfUser) {
    findRtpOfUser = await rtpService.create({
      userId: convertIdToMongooseId(userId),
      wheelId: convertIdToMongooseId(wheelId),
      rtpPercentage: CONSTANTS.RETURN_TO_PLAYER.DEFAULT,
      totalSpins: 0,
      winingProbability: 0,
      betLimitation: 10000,
      rtpCheck: false,
    });
  }

  // get game stats where we get rtp and winning percentage as of all games played
  let getGame = await getGames(userId, wheelId);

  /** 
  first: check for rtCheck key , 
  second: if we want to check according to table, 
  third: if calculated rtp is less than given rtp of user
  */

  let rtpToCheck = 0;
  let findGlobalRtp = await rtpService.findGlobal();

  if (findRtpOfUser.globalRtp && findGlobalRtp.length > 0 && findGlobalRtp[0].globalRtp) {
    //  for global 
    rtpToCheck = findGlobalRtp[0].globalRtpPercentage
  } else if (!findRtpOfUser.globalRtp) {
    //  for user specific rtp
    rtpToCheck = findRtpOfUser.rtpPercentage
  } else if (findRtpOfUser.globalRtp && findGlobalRtp.length > 0 && !findGlobalRtp?.[0].globalRtp) {
    //  according to the rtp table
    rtpToCheck = getRTPForSpins(findRtpOfUser.totalSpins + 1)
  }

  if (
    (findRtpOfUser.rtpCheck ||
      Object.keys(CONSTANTS.MINIMUM_RTP_CALCULATION).includes(
        String(findRtpOfUser.totalSpins + 1)
      )) &&
    getGame[0].rtp < rtpToCheck
  ) {
    // if reward is negative then i want to rerun the function till i get positive
    const maxRetries = 10;
    if (userReward < 0 && retryCounter < maxRetries) {
      await rtpService.updateOne(
        {
          userId: convertIdToMongooseId(userId),
          wheelId: convertIdToMongooseId(wheelId),
        },
        {
          $set: {
            rtpCheck: true,
          },
        }
      );

      retryCounter++;
      return await spinTheWheel(payload);
    }
  } else if (
    (getGame[0]?.rtp ?? 0) > rtpToCheck &&
    findRtpOfUser.rtpCheck
  ) {
    await rtpService.updateOne(
      {
        userId: convertIdToMongooseId(userId),
        wheelId: convertIdToMongooseId(wheelId),
      },
      {
        $set: {
          rtpCheck: false,
        },
      }
    );
  }

  // create game result entry
  const gameResult = await gameService.createGame({
    winLossStatus:
      userOutcome[userOutcome.length - 1].symbolsType === 1 ? 2 : 1,
    outcome: userOutcome.map((outcome) => convertIdToMongooseId(outcome._id)),
    betAmount: betAmount,
    outcomeAmount: Math.abs(userReward),
    userId: convertIdToMongooseId(userId),
    wheelId: convertIdToMongooseId(wheelId),
  });

  // increase the number of spins
  await rtpService.updateOne(
    {
      userId: convertIdToMongooseId(userId),
      wheelId: convertIdToMongooseId(wheelId),
    },
    {
      $inc: {
        totalSpins: 1,
      },
    }
  );


  // create transaction for user
  await createTransaction(userId, userReward)


  // update user wallet
  await transactionService.updateWallet({ userId: convertIdToMongooseId(userId) }, {
    $set: {
      userId: userId,
    },
    $inc: {
      credits: userReward
    }
  }, { upsert: true });

  // find admin wallet
  const findAdminWallet = await transactionService.findAllWallets({
    companyAccount: true,
    credits: { $gte: Math.abs(userReward) },
  })

  if (!findAdminWallet.length) {
    return createErrorResponse(PAYMENT_NOT_PROCESSED, CONSTANTS.ERROR_TYPES.BAD_REQUEST, gameResult)
  }

  const adminWallet = findAdminWallet[0];

  // transaction for admin
  await createTransaction(adminWallet.userId, -userReward);

  // update admin wallet
  await transactionService.updateWallet({ userId: convertIdToMongooseId(adminWallet.userId) }, {
    $set: {
      userId: adminWallet.userId,
    },
    $inc: {
      credits: -userReward
    }
  }, { upsert: true });



  // create success response
  return createSuccessResponse(SUCCESS, gameResult);
};


const createTransaction = async (userId, userReward) => {
  await transactionService.create({
    userId: userId,
    paymentType: CONSTANTS.PAYMENT_TYPE.CARD,
    amount: userReward,
    approved: true,
  })
}
const getRTPForSpins = (spins) => {
  const spinKeys = Object.keys(CONSTANTS.MINIMUM_RTP_CALCULATION)
    .map(Number) // Convert keys to numbers
    .sort((a, b) => a - b); // Sort in ascending order

  let matchedKey = spinKeys[0]; // Default to the first key

  // Find the largest key that is less than or equal to the number of spins
  for (const key of spinKeys) {
    if (spins >= key) {
      matchedKey = key;
    } else {
      break; // Stop once we've passed the number of spins
    }
  }

  return CONSTANTS.MINIMUM_RTP_CALCULATION[matchedKey];
};

const handleSymbol = (symbolsArray) => {
  let arrowCount = 0;
  let userOutcome = [];
  let findRandomSymbol;

  while (arrowCount < 2) {
    findRandomSymbol = commonFunctions.getRandomObject(symbolsArray);

    if (findRandomSymbol.symbolsType === CONSTANTS.ARROW_SYMBOLS.ARROW_SYMBOL) {
      arrowCount++;

      if (arrowCount === 2) {
        userOutcome.push(findRandomSymbol);
        return userOutcome;
      }
    } else {
      userOutcome.push(findRandomSymbol);
      return userOutcome;
    }
  }

  return userOutcome;
};

const adminGameDetails = async () => {
  const gameDetails = await gameService.getAdminGameDetails();

  return createSuccessResponse(SUCCESS, gameDetails);
};

module.exports = {
  spinTheWheel,
  adminGameDetails,
};
