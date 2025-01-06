"use strict";

const MODELS = require("../models");
const CONFIG = require("../../config");
const { hashPassword } = require("../utils/utils");
const CONSTANTS = require("./constants");
const { userService, transactionService } = require("../services");

const dbMigrations = {};

/**
 * Function to run migrationsfor database based on version number.
 * @returns
 */
dbMigrations.migerateDatabase = async () => {
  let dbVersion = await MODELS.dbVersionModel.findOne({});
  if (!dbVersion || dbVersion.version < 1) {
    await dbMigrations.createAdmin();
    dbVersion = await MODELS.dbVersionModel.findOneAndUpdate(
      {},
      { version: 1 },
      { upsert: true, new: true }
    );
  }
};

/**
 * Function to create admin
 * @returns
 */
dbMigrations.createAdmin = async () => {
  const data = {
    name: CONFIG.ADMIN.NAME,
    email: CONFIG.ADMIN.EMAIL,
    password: hashPassword(CONFIG.ADMIN.PASSWORD),
    username: CONFIG.ADMIN.USERNAME,
    role: 1,
    isVerified: true,
  };


  const admin = await userService.create(data);
  const walletData = {
    userId: admin._id,
    credits: CONSTANTS.DEFAULT_CREDITS,
    companyAccount: true
  }
  await transactionService.createWallet(walletData);

   
  return;
};

module.exports = dbMigrations;
