const { MongoClient } = require('mongodb');

const MONGO_URL = "mongodb+srv://root:debarun@debarundb.ue3zl4s.mongodb.net/";

async function run() {
  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    const db = client.db('FixMyCity');
    const users = await db.collection('users').find().toArray();
    console.log('Users in database:');
    users.forEach(u => {
      console.log(`- _id: ${u._id} (${typeof u._id}), id: ${u.id} (${typeof u.id}), name: ${u.firstname} ${u.lastname}, role: ${u.role}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

run();
