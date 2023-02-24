const query = `mutation printRequest($printRequest: PrintRequest!, $printer: String!) {
  print(printRequest: $printRequest, printer: $printer) {
    jobId
  }
}`

const headers = {
  'Content-Type': 'application/json',
}

export { query, headers }
