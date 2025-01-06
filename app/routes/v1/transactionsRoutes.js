const { transactionController } = require("../../controllers");
const { USER_ROLES } = require("../../utils/constants");
const { Joi } = require("../../utils/joiUtils");


module.exports = [
    {
        method: "POST",
        path: "/transaction",
        auth: true,
        roleAccess: [USER_ROLES.ADMIN, USER_ROLES.USER],
        joiSchemaForSwagger: {
            group: "TRANSACTIONS",
            description: "Route for creating a transaction.",
            model: "transactions",

            query: {
                userId: Joi.string().description("User Id Details").required(),
            },
            body: {

                paymentType: Joi.number().description("Payment Type").required(),
                amount: Joi.number().description("Amount").required(),
                approved: Joi.boolean().description("Approved Status").optional(),
            },
        },
        handler: transactionController.createTransaction,
    },
    {
        method: "PUT",
        path: "/transaction",
        auth: true,
        roleAccess: [USER_ROLES.ADMIN],
        joiSchemaForSwagger: {
            group: "TRANSACTIONS",
            description: "Route for updating a transaction.",
            model: "transactions",

            query: {
                userId: Joi.string().description("User Id Details").required(),
                id: Joi.string().description("transaction Id Details").required(),
            },
            body: {
                approved: Joi.boolean().description("Approved Status").optional(),
            },
        },
        handler: transactionController.updateTransaction,
    },
    {
        method: "GET",
        path: "/wallet/:userId",
        auth: true,
        roleAccess: [USER_ROLES.ADMIN, USER_ROLES.USER],
        joiSchemaForSwagger: {
            group: "WALLETS",
            description: "Route for Getting the wallet.",
            model: "wallets",

            params: {
                userId: Joi.string().description("User Id Details").required(),
            },

        },
        handler: transactionController.getWalletDetails,
    },
    {
        method: "GET",
        path: "/credits",
        auth: true,
        roleAccess: [USER_ROLES.ADMIN, USER_ROLES.USER],
        joiSchemaForSwagger: {
            group: "WALLETS",
            description: "Route for Getting the credits.",
            model: "wallets",

            query: {
                limit: Joi.number().description("Limit of data").default(10).required(),
                index: Joi.number().description("start Index of data").default(0).required(),
            },
        },
        handler: transactionController.getCreditsDetails,
    },
    {
        method: "GET",
        path: "/transaction",
        auth: true,
        roleAccess: [USER_ROLES.ADMIN, USER_ROLES.USER],
        joiSchemaForSwagger: {
            group: "TRANSACTIONS",
            description: "Route for Getting the transaction.",
            model: "transaction",

            query: {
                sortDirection:  Joi.number().description("direction of sorting").default(-1).optional(),
                sortKey:Joi.string().description("key on basis of which sort will be decided").default("").optional(),
                userId: Joi.string().description("Users Transactions").default("").optional(),
                limit: Joi.number().description("Limit of data").default(10).required(),
                index: Joi.number().description("start Index of data").default(0).required(),
            },
        },
        handler: transactionController.getAllTransactions,
    }
]