<template>
  <b-container>
    <h1 class="mt-3 mb-3">Deep-Well Plates</h1>
    <b-card
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
export default defineComponent({
  name: 'DeepWellPlates',
  data() {
    return {
      plateBarcodes: '',
      resultFields: [
        { key: 'barcode', label: 'Plate Barcode' },
        { key: 'result', label: 'Status / Errors' },
        { key: 'ready', label: 'Ready for Limber' },
      ],
      results: [
        {
          barcode: 'TEST-123456',
          result: "Error:  Plate with barcode 'TEST-123456' already exists.",
          ready: 'Yes',
        },
      ],
    }
  },
  methods: {
    clearBarcodes() {
      this.plateBarcodes = ''
    },
    submitBarcodes() {
      console.log('Submitted')
    },
  },
})
</script>

<style scoped>
.tip {
  font-size: 85%;
}
</style>
