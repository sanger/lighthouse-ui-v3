let config = useRuntimeConfig()

const getPlatesFromBoxBarcodes = async (...boxBarcodes) => {
  try {
    const url = `${config.labwhereBaseURL}/labwares?location_barcodes=${boxBarcodes}`
    const response = await useFetch(url)

    const barcodes = response.data.value.map((plate) => plate.barcode)

    if (barcodes.length) {
      return { success: true, barcodes }
    } else {
      return { success: false, error: 'The box has no plates' }
    }
  } catch (error) {
    return { success: false, error }
  }
}

const labwhere = { getPlatesFromBoxBarcodes }

export default labwhere
