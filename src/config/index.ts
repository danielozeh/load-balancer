import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT || 5000,
    support_email: process.env.SUPPORT_EMAIL || 'danielozeh@gmail.com',
    mongo_url: process.env.MONGO_URL || 'mongodb+srv://pharma360-user:iHaQdYEdBLP0xBB0@pharma360.8ihbftu.mongodb.net/load_balancing-db?retryWrites=true&w=majority',
    mongo_replica_set: process.env.MONGO_REPLICA_SET,
    switches: [
        { id: 'switch1', url: 'http://localhost:5001' },
        { id: 'switch2', url: 'http://localhost:5002' },
        { id: 'switch3', url: 'http://localhost:5003' },
        { id: 'switch4', url: 'http://localhost:5004' },
        { id: 'switch5', url: 'http://localhost:5005' }
    ]
}
