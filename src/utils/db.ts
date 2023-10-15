import { connect, connection } from 'mongoose'

let MONGO_URI: string

if (process.env.ENV !== 'test') {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set!')
  }
  MONGO_URI = process.env.MONGO_URI
}
if (process.env.ENV === 'test') {
  if (!process.env.MONGO_URI_TEST) {
    throw new Error('MONGO_URI_TEST environment variable is not set for testing environment!')
  }
  MONGO_URI = process.env.MONGO_URI_TEST
}

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

export const connectToDatabase = async () => {
  if (!connection.readyState) {
    connect(MONGO_URI, options)
  } else {
    console.log('Already connected to ', MONGO_URI)
  }
}
