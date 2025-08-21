import mongoose from 'mongoose'
import { config } from '../app-infrastructure/app-config'
import { MONGODB_TITLE } from './const/mongodb_title'

export async function connectToMongo() {
  await mongoose.connect(config.mongoUri, {
    dbName: config.dbName,
  })

  mongoose.connection.on('connected', () => {
    console.log(MONGODB_TITLE.connected)
  })

  mongoose.connection.on('error', (err) => {
    console.error(MONGODB_TITLE.error, err)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn(MONGODB_TITLE.disconnected)
  })
}
