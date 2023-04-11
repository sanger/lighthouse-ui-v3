<template>
  <b-container>
    <h1 class="mt-3 mb-3">Deep-Well Plates</h1>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Create">
          <b-card
            title="Create Deep-Well Plates"
            subtitle="Generate externally sourced deep-well plates in Sequencescape so that they may be stamped to shallow-well plates using Limber."
          >
            <label for="plate-barcodes" class="mt-3 mb-2">Please scan plate barcode(s): </label>
            <b-form-textarea
              id="plate-barcodes"
              ref="plateBarcodesInput"
              v-model="plateBarcodes"
              rows="5"
              max-rows="6"
              @keydown.ctrl.enter="submitBarcodes()"
            />
            <p class="text-muted text-end tip">
              <b>Tip:</b> You can also submit with Ctrl + Enter.
            </p>
            <div class="float-end">
              <b-button
                id="clearBarcodes"
                variant="outline-secondary"
                class="me-2"
                @click="clearBarcodes()"
              >
                Clear
              </b-button>
              <b-button id="submitBarcodes" variant="primary" @click="submitBarcodes()">
                Submit
              </b-button>
            </div>
          </b-card>
        </b-tab>
        <b-tab title="Results">
          <b-card
            title="Create Plate Results"
            subtitle="Entries below show the result of each create deep-well plate request submitted."
          >
            <ul class="mt-3">
              <li>Submit some create plate requests to see the results here.</li>
            </ul>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script lang="ts">
export default defineComponent({
  name: 'DeepWellPlates',
  data() {
    return {
      plateBarcodes: '',
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
