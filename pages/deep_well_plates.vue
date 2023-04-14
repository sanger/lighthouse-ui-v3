<template>
  <b-container>
    <h1 class="mt-3 mb-3">Deep-Well Plates</h1>
    <b-card
      class="input-area"
      title="Import Deep-Well Plates"
      subtitle="Add externally sourced deep-well plates to Sequencescape so that they can be stamped to shallow-well plates using Limber."
    >
      <label for="plate-barcodes" class="mt-3 mb-2">Please scan plate barcode(s):</label>
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
        <b-button id="submitBarcodes" variant="primary" @click="submitBarcodes()">
          Submit
        </b-button>
      </div>
    </b-card>
    <br />
    <h3>Import Results</h3>
    <b-table
      id="imports-table"
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
  data: { value: object }
  error: { value: { data: { errors: string[] } } }
}

export default defineComponent({
  name: 'DeepWellPlates',
  data() {
    return {
      plateBarcodes: 'BB-00049030',
      resultFields: [
        { key: 'barcode', label: 'Plate Barcode' },
        { key: 'status', label: 'Status / Errors' },
        { key: 'ready', label: 'Ready for Limber' },
      ],
      results: Array<object>(),
    }
  },
  methods: {
    clearBarcodes() {
      this.plateBarcodes = ''
    },
    async submitBarcodes() {
      const barcodes = this.parseBarcodes(this.plateBarcodes)
      const responses = await lighthouseService.createPlatesFromBarcodes({
        barcodes,
        type: 'rvi_deep_well_96',
      })
      this.handleSubmissionResponses(barcodes, responses)
    },
    /**
     * Parse barcodes by splitting on white space, throwing away empty values and
     * then removing duplicates from the list.
     */
    parseBarcodes(barcodes: string) {
      const listNoBlanks = barcodes.split(/\s+/).filter((b) => b !== '')
      return [...new Set(listNoBlanks)]
    },
    createStatus(response: Response): string {
      if (response.data.value !== null) {
        return 'Plate was imported successfully.'
      }

      if (response.error.value !== null) {
        const errors = response.error.value.data.errors.join('\n')
        if (/is already in use\.$/.test(errors)) {
          return 'The barcode already exists in Sequencescape.'
        } else {
          return `Errors:\n${errors}`
        }
      }

      return 'Unhandled response received.'
    },
    createReady(status: string): string {
      if (/^Errors:/.test(status)) {
        return 'No'
      }

      if (/^Unhandled response received\.$:/.test(status)) {
        return 'Unknown'
      }

      return 'Yes'
    },
    createResult(barcode: string, response: Response): object {
      const status = this.createStatus(response)
      const ready = this.createReady(status)
      return {
        barcode: barcode,
        status,
        ready,
      }
    },
    handleSubmissionResponses(barcodes: string[], responses: Response[]) {
      const newResults = barcodes.map((barcode, idx) => this.createResult(barcode, responses[idx]))
      this.results = [...this.results, ...newResults]
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
