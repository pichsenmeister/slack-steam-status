const admin = require("firebase-admin");

if (process.env.GLITCH) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
} else {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();

const findTeam = async id => {
  const doc = await db
    .collection("teams")
    .doc(id)
    .get();
  if (doc.exists) return doc.data();
  return false;
};

const saveTeam = async (id, context) => {
  if (!context) throw new Error("no_team_data");

  await db
    .collection("teams")
    .doc(id)
    .set(context);
};

const findUser = async id => {
  const doc = await db
    .collection("users")
    .doc(id)
    .get();
  if (doc.exists) return doc.data();
  return false;
};

const saveUser = async (id, context) => {
  if (!context) throw new Error("no_user_data");
  await db
    .collection("users")
    .doc(id)
    .set(context);
  return context;
};

module.exports = {
  findTeam,
  saveTeam,
  findUser,
  saveUser
};
