const config = useRuntimeConfig()

const createPayloadForCherrypickBatch = (barcodes) => {
  const { asynchronous, studyId, projectId } = config.public
  return {
    data: {
      type: 'pick_lists',
      attributes: {
        asynchronous,
        labware_pick_attributes: barcodes.map((plateBarcode) => ({
          source_labware_barcode: plateBarcode,
          study_id: parseInt(studyId),
          project_id: parseInt(projectId),
        })),
      },
    },
  }
}

const createCherrypickBatch = async (barcodes) => {
  const body = createPayloadForCherrypickBatch(barcodes)

  try {
    const response = await useFetch(`${config.public.sequencescapeBaseURL}/pick_lists`, {
      body,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      method: 'POST',
    })
    return {
      success: true,
      data: response.data.value.data,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

const sequencescape = { createCherrypickBatch, createPayloadForCherrypickBatch }

export default sequencescape
