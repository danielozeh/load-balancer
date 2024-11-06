import mongoose from 'mongoose';
import config from '../../config'

const OPTIONS = {
    replicaSet: config.mongo_replica_set,
    // useNewUrlParser: true,
    maxPoolSize: 2,
    socketTimeoutMS: 600000, //kill idle connections after 10 minutes
    // useUnifiedTopology: true,
    // ssl: false
}

const InitaliseAppDatabase = async (URI: any, type: string) => {

    try {
        await mongoose.connect(URI, OPTIONS);  // Wait for the connection to be established
        console.log(`${type} Connected Successfully!`);
    } catch (err) {
        console.log(`Could not connect to ${type} because of ${err}`);
        process.exit(-1);  // Optionally exit the app if the connection fails
    }
}

InitaliseAppDatabase(config.mongo_url, 'Load Balancing Service Database');

export default mongoose
