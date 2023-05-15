const read = async (file) => {
  const reader = new FileReader()
  const promise = new Promise((resolve, reject) => {
    try {
      reader.onload = () => {
        const result = reader.result
        resolve(result)
      }
      reader.readAsText(file)
    } catch (error) {
      reject(error)
    }
  })

  try {
    // the promise is in essence a file stream
    const data = await promise
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

const parse = (data) => {
  // split data into rows
  const rows = data.split(/\r?\n/)

  // headers are on the first row remove it and turn into an array of headers
  const headers = rows.shift().split(',')

  // return a json object which will be an array of records
  return rows.map((row) => {
    // each record is turned into an object
    // with each item with a key of its header
    return row.split(',').reduce((record, item, index) => {
      record[headers[index]] = item
      return record
    }, {})
  })
}

const CSV = {
  read,
  parse,
}

export default CSV
