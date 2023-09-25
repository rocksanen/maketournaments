type AnyObj = { [key: string]: any }

function renameIdField(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => renameIdField(item))
  } else if (obj !== null && typeof obj === 'object') {
    let newObj: AnyObj = {}
    for (let key in obj) {
      if (
        obj[key] &&
        typeof obj[key].valueOf === 'function' &&
        obj[key].constructor.name === 'ObjectId'
      ) {
        newObj[key === '_id' ? 'id' : key] = obj[key].toString()
      } else if (obj[key] && obj[key].constructor.name === 'Date') {
        newObj[key] = obj[key].toISOString()
      } else {
        newObj[key === '_id' ? 'id' : key] = renameIdField(obj[key])
      }
    }
    return newObj
  }
  return obj
}

export { renameIdField }
