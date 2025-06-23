import mongoose from "mongoose"

/**
 * Connects to the MongoDB database using the connection string in environment variables.
 * Logs the connection status or exits on failure.
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected ${conn.connection.host}`)
    } catch (error) {
        console.log("Error connecting to database", error)
        process.exit(1)
    }
};