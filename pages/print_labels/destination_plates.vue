<template>
  <b-container>
    <b-row>
      <b-col>
        <PrintLabelsRouter />
        <h1>Print destination plate labels</h1>
        <p class="lead"></p>
        <StatusAlert ref="statusAlert" />
        <p>
          <label for="selectPrinter">Which printer would you like to use?</label>
          <b-form-select id="selectPrinter" v-model="printer" :options="printers"></b-form-select>
        </p>
        <p>
          <label for="numberOfBarcodes">How may labels would you like to print?</label>
          <b-form-input
            id="numberOfBarcodes"
            v-model="numberOfBarcodes"
            type="number"
            min="1"
          ></b-form-input>
        </p>
        <p class="text-right">
          <b-button
            id="printLabels"
            class="container-fluid"
            size="lg"
            variant="primary"
            :disabled="isBusy"
            @click="printLabels"
          >
            Print labels
            <b-spinner v-show="isBusy" small></b-spinner>
          </b-button>
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PrintLabelsRouter from '@/components/PrintLabelsRouter'
import StatusAlert from '@/components/StatusAlert'

const config = useRuntimeConfig()

export default {
  components: {
    PrintLabelsRouter,
    StatusAlert,
  },
  props: {
    printers: {
      type: Array,
      default() {
        return config.printers.split(',')
      },
    },
  },
  data() {
    return {
      printer: this.printers[0],
      numberOfBarcodes: '1',
    }
  },
  computed: {
    isBusy() {
      return this.$refs.statusAlert?.isBusy
    },
  },
  methods: {
    async printLabels() {
      this.$refs.statusAlert.setStatus('Busy', 'Printing labels…')

      const response = await sprintGeneralLabels.printDestinationPlateLabels({
        numberOfBarcodes: this.numberOfBarcodes,
        printer: this.printer,
      })

      if (response.success) {
        this.$refs.statusAlert.setStatus('Success', response.message)
      } else {
        this.$refs.statusAlert.setStatus('Error', response.error)
      }
    },
  },
}
</script>

<style></style>
