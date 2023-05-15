import Baracoda from '@/utils/baracoda'
import { query, headers } from '@/utils/sprint_constants'
import layoutTemplate from '@/config/templates/sprint_general_label_layout.json'
import TemplateRenderer from './template_renderer'

const config = useRuntimeConfig()
const renderLayout = TemplateRenderer(layoutTemplate)

/*
  Creates the print request body
  A query can have multiple layouts
  the number of layouts is dependent on the number of LabelFields
  the printer must be specified
*/
const createPrintRequestBody = ({ labelFields, printer }) => ({
  query,
  variables: {
    printer,
    printRequest: {
      // turns each labelField into a layout
      layouts: labelFields.map((labelField) => renderLayout(labelField)),
    },
  },
})

/*
  adds the text for each barcode to generate an
  array of objects which will have a barcode and text
  the text will be the same for all barcodes
  e.g. createLabelFields(barcodes: ['DN111111', 'DN222222'], text: 'LHTR')
  will return [ { barcode: 'DN111111', text: 'LHTR' }, { barcode: 'DN222222', text: 'LHTR' } ]
*/
const createLabelFields = ({ barcodes, text }) => {
  return barcodes.map((barcode) => ({ barcode, text }))
}

/*
  accepts labelFields and printer
  will create the print request body
  and send a request to sprint to print labels
*/
const printLabels = async ({ labelFields, printer }) => {
  try {
    const body = createPrintRequestBody({ labelFields, printer })

    const response = await useFetch(config.public.sprintBaseURL, { body, headers, method: 'POST' })

    // because this is GraphQL it will always be a success unless it is a 500
    // so we need to extract the error messages and turn it into an error object
    if (response.data.value.errors)
      throw new Error(response.data.value.errors.map(({ message }) => message).join(','))

    return {
      success: true,
      message: `Successfully printed ${labelFields.length} labels to ${printer}`,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

/*
  accepts count and printer
  count is the number of barcodes which is what baracoda needs
  creates the barcodes via a call to baracoda
  will create the print request body
  and send a request to sprint to print labels
*/
const printDestinationPlateLabels = async ({ numberOfBarcodes, printer }) => {
  try {
    const barcodeResponse = await Baracoda.createBarcodes({
      barcodesGroup: config.public.destinationPlateBarcodesGroup,
      count: numberOfBarcodes,
    })

    // we don't want to proceed unless the barcodes have been created
    if (!barcodeResponse.success) {
      return barcodeResponse
    }

    // we need to turn the barcodes into a bunch of label fields
    const labelFields = createLabelFields({
      ...barcodeResponse,
      text: config.public.projectAcronym,
    })

    // print the labels
    const printResponse = await Sprint.printLabels({ labelFields, printer })

    // even if success is false, the object here is in the correct format
    return printResponse
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

const Sprint = {
  createPrintRequestBody,
  printLabels,
  printDestinationPlateLabels,
  createLabelFields,
}

export default Sprint
