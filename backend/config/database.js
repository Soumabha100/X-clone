import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database using the connection
 * string provided in the environment variables.
 */
const databaseConnection = () => {
    // Use Mongoose to connect to the database.
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        // Log a success message to the console if the connection is successful.
        console.log("Connected to mongoDB");
    }).catch((error)=>{
        // Log any errors that occur during the connection attempt.
        console.log(error);
    })
}

export default databaseConnection;
