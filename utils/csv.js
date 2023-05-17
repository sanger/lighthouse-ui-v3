class CSVParsingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CSVParsingError'
  }
}

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

const validateData = (headers, rows) => {
  // check that the headers are all populated
  headers.forEach((header, index) => {
    if (header.length === 0) {
      throw new CSVParsingError(`Header in column ${index + 1} is un-named.`)
    }

    if (headers.filter((fHeader) => header === fHeader).length > 1) {
      throw new CSVParsingError(`More than one column has the header "${header}".`)
    }
  })

  rows.forEach((row, index) => {
    // create an error if this row is empty and not the last line in the file
    if (row.length === 0 && index < rows.length - 1) {
      throw new CSVParsingError(`Line ${index + 2} contains no data.`)
    }

    const cells = row.split(',')

    // create an error if this row has the wrong number of fields
    // unless it's empty which can happen for the last line of the file
    if (row.length > 0 && cells.length !== headers.length) {
      throw new CSVParsingError(
        `Line ${index + 2} has the wrong number of fields: ${cells.length} when there should be ${
          headers.length
        }.`
      )
    }
  })
}

const parse = (data) => {
  // split data into rows
  const rows = data.split(/\r?\n/)

  // headers are on the first row remove it and turn into an array of headers
  const headers = rows.shift().split(',')

  try {
    validateData(headers, rows)
  } catch (error) {
    return { success: false, error }
  }

  const rowData = rows.map((row) => {
    // each record is turned into an object
    // with each item with a key of its header
    const cells = row.split(',')

    return cells.reduce((record, item, index) => {
      record[headers[index]] = item
      return record
    }, {})
  })

  // return a json object with an array of records
  return { success: true, data: rowData }
}

const CSV = {
  read,
  parse,
}

export { CSVParsingError }
export default CSV
