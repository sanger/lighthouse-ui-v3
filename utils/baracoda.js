const config = useRuntimeConfig()

// return a bunch of barcodes from baracoda
const createBarcodes = async ({ barcodesGroup, count }) => {
  try {
    const response = await useFetch(
      `${config.public.baracodaBaseURL}/barcodes_group/${barcodesGroup}/new`,
      {
        params: { count },
        method: 'POST',
      }
    )
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
