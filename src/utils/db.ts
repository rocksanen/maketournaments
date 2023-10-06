import { connect, connection } from 'mongoose'

let MONGO_URI = 'null'

if (process.env.ENV !== 'test') {
  MONGO_URI = process.env.MONGO_URI || 'null'
}
if (process.env.ENV === 'test') {
  MONGO_URI = process.env.MONGO_URI_TEST || 'null'
}

const options: any = {
  useUnifiedTopology: true,

  useNewUrlParser: true,
}

export const connectToDatabase = async () => {
  if (!connection.readyState) {
    console.log('process.env.MONGO_URI_TEST', process.env.MONGO_URI_TEST)
    console.log('process.env.MONGO_URI', process.env.MONGO_URI)
    console.log('usedmongouri', MONGO_URI)
    console.log('Connecting to ', MONGO_URI)
    connect(MONGO_URI, options)
  } else {
    console.log('Already connected to ', MONGO_URI)
  }
}
