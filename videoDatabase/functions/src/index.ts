/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import addQueueDataFromTelegram from "./firebaseFunctions/addQueueDataFromTelegram";
import updateQueueStatus from "./firebaseFunctions/updateQueueStatus";
import addQueueDataFromWeb from "./firebaseFunctions/addQueueDataFromWeb";


export const addQueueFromTelegramFunction = onRequest(addQueueDataFromTelegram);
export const updateQueueFunction = onRequest(updateQueueStatus);
export const addQueueFromWebFunction = onRequest(addQueueDataFromWeb);