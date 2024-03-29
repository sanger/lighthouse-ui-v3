<template>
  <b-container>
    <h1 class="mt-3 mb-3">Deep-Well Plates</h1>
    <b-card
      class="input-area"
      title="Import Deep-Well Plates"
      subtitle="Add externally sourced deep-well plates to Sequencescape so that they can be stamped to shallow-well plates using Limber."
    >
      <div class="mt-3 alert alert-warning">
        <b>Note:</b> Once plates have been imported through this page, they will no longer be
        suitable for picking as part of the Heron pipeline.
      </div>
      <label for="plate-barcodes" class="mb-2">Please scan plate barcode(s):</label>
      <b-form-textarea
        id="plate-barcodes"
        ref="plateBarcodesInput"
        v-model="plateBarcodes"
        rows="5"
        max-rows="6"
        @keydown.ctrl.enter="submitBarcodes()"
      />
      <p class="text-muted text-end tip"><b>Tip:</b> You can also submit with Ctrl + Enter.</p>
      <b-button
        id="clearBarcodes"
        variant="outline-secondary"
        class="me-2"
        @click="clearBarcodes()"
      >
        Clear
      </b-button>
      <div class="float-end">
        <b-button
          id="submitBarcodes"
          variant="primary"
          :disabled="isBusy() || !isValid()"
          @click="submitBarcodes()"
        >
          Submit
          <b-spinner v-show="isBusy()" id="busySpinner" small></b-spinner>
        </b-button>
      </div>
    </b-card>
    <br />
    <h3>Import Results</h3>
    <b-table
      id="resultsTable"
      class="mt-3"
      show-empty
      responsive
      :items="results"
      :fields="resultFields"
      hover
      head-variant="light"
    />
  </b-container>
</template>

<script lang="ts">
type Response = {
  data: { value: object | null }
  error: { value: { data: { errors: string[] }; statusCode: number } | null }
}
interface ResultStatus {
  status: string
  ready: string
  _rowVariant: string
}
interface ResultRow extends ResultStatus {
  barcode: string
}

export default defineComponent({
  name: 'DeepWellPlates',
  data() {
    return {
      status: Status.Idle,
      plateBarcodes: '',
      resultFields: [
        { key: 'barcode', label: 'Plate Barcode' },
        { key: 'status', label: 'Status / Errors' },
        { key: 'ready', label: 'Ready for Limber' },
      ],
      results: Array<ResultRow>(),
    }
  },
  methods: {
    isBusy(): boolean {
      return this.status === Status.Busy
    },
    isValid(): boolean {
      return this.parsedBarcodes().length > 0
    },
    clearBarcodes() {
      this.plateBarcodes = ''
    },
    async submitBarcodes() {
      this.status = Status.Busy
      const barcodes = this.parsedBarcodes()
      const responses = await lighthouseService.createPlatesFromBarcodes({
        barcodes,
        type: 'rvi_deep_well_96',
      })
      this.handleSubmissionResponses(barcodes, responses)
      this.status = Status.Idle
    },
    /**
     * Parse barcodes by splitting on white space, throwing away empty values and
     * then removing duplicates from the list.
     */
    parsedBarcodes() {
      const listNoBlanks = this.plateBarcodes.split(/\s+/).filter((b) => b !== '')
      return [...new Set(listNoBlanks)]
    },
    createStatus(response: Response): ResultStatus {
      try {
        if (response.data.value !== null) {
          return {
            status: 'Plate was imported successfully.',
            ready: 'Yes',
            _rowVariant: 'success',
          }
        }

        if (response.error?.value !== null) {
          if (response.error.value.statusCode === 500) {
            return {
              status: 'There was a problem processing the request; please try again.',
              ready: 'Unknown',
              _rowVariant: 'warning',
            }
          }

          if (response.error.value.data?.errors !== null) {
            const errors = response.error.value.data.errors.join('; ')
            if (/is already in use\.$/.test(errors)) {
              return {
                status: 'The barcode already exists in Sequencescape.',
                ready: 'Yes',
                _rowVariant: 'success',
              }
            } else {
              return { status: `Errors:  ${errors}`, ready: 'No', _rowVariant: 'danger' }
            }
          }
        }
      } catch {
        // Fall into the unhandled response below
      }

      return {
        status: 'Unhandled response received; please try again.',
        ready: 'Unknown',
        _rowVariant: 'warning',
      }
    },
    handleSubmissionResponses(barcodes: string[], responses: Response[]) {
      this.results = barcodes.map((barcode, idx) => {
        return { barcode, ...this.createStatus(responses[idx]) }
      })
    },
  },
})
</script>

<style scoped>
.input-area {
  background-color: rgba(0, 0, 0, 0.03);
}
.tip {
  font-size: 85%;
}
</style>
