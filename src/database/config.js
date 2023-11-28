import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGO_DB);
        console.log('Base de datos online!');
    } catch (error) {
        console.log(`Error con la base de datos. ${error}`);
        process.exit(1);
    }
}