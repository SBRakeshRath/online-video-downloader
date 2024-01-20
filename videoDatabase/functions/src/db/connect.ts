import { firestore } from "firebase-admin";
export default async function connect() {
  const db = firestore();
  return db;
}
