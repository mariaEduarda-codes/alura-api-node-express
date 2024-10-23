import mongoose from "mongoose";

async function conectaNaDatabase() {
    mongoose.connect(process.env.DB_CONNECTION_STRING);

    return mongoose.connection;
}

export default conectaNaDatabase;
//
// mongoose.connect(process.env.DB_CONNECTION_STRING);
//
// let db = mongoose.connection;
//
// export default db;