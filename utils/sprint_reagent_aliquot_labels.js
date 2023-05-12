import { query, headers } from '@/utils/sprint_constants'
import layoutTemplate from '@/config/templates/sprint_reagent_aliquot_label_layout.json'
import SprintLabelLayout from './sprint_label_layout'

const config = useRuntimeConfig()
const labelLayout = new SprintLabelLayout(layoutTemplate)

/*
  Creates the print request body
  A query can have multiple layouts
  the number of layouts is dependent on the specified quantity
  the printer must be specified
*/
const createPrintRequestBody = ({ barcode, firstText, secondText, printer, quantity }) => ({
  query,
  variables: {
    printer,
    printRequest: {
      // turns each labelField into a layout
      layouts: Array.from({ length: quantity }, () =>
        labelLayout.create({ barcode, firstText, secondText })
      ),
    },
  },
})

/*
  accepts fields to be printed on each label, printer and quantity of labels
  will create the print request body
  and send a request to sprint to print labels
*/
const printLabels = async ({ barcode, firstText, secondText, printer, quantity }) => {
  try {
    const parsedQuantity = parseInt(quantity)

    if (isNaN(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 100) {
      throw new Error('Quantity should be between 1 and 100.')
    }

    const body = createPrintRequestBody({
      barcode,
      firstText,
      secondText,
      printer,
      quantity: parsedQuantity,
    })

    const response = await useFetch(config.public.sprintBaseURL, { body, headers, method: 'POST' })

    // because this is GraphQL it will always be a success unless it is a 500
    // so we need to extract the error messages and turn it into an error object
    if (response.data.value.errors) {
      throw new Error(response.data.value.errors.map(({ message }) => message).join(','))
    }

    const labelString = parsedQuantity === 1 ? 'label' : 'labels'
    return {
      success: true,
      message: `Successfully printed ${parsedQuantity} ${labelString} to ${printer}`,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

export default printLabels
export { createPrintRequestBody }
