const config = useRuntimeConfig()

// return a bunch of barcodes from baracoda
const createBarcodes = async ({ count }) => {
  try {
    const response = await useFetch(`${config.baracodaBaseURL}/barcodes_group/HT/new`, {
      body: count,
      method: 'POST',
    })
    return {
      success: true,
      ...response.data.value.barcodes_group,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

const Baracoda = {
  createBarcodes,
}

export default Baracoda
