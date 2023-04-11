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
            <label for="plate-barcodes" class="mt-3 mb-2"
              >Please scan deep-well plate barcode(s):
            </label>
            <b-form-textarea id="plate-barcodes" v-model="plateBarcodes" rows="5" max-rows="6" />
            <b-button id="submit" variant="primary" class="mt-3 float-end" @click="submit()">
              Submit
            </b-button>
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
    submit() {},
  },
})
</script>
