<template>
  <b-container>
    <b-row>
      <b-col>
        <PrintLabelsRouter />
        <h1>Print ad hoc plate labels</h1>
        <p class="lead"></p>
        <StatusAlert ref="statusAlert" />
        <p>
          <label for="selectPrinter"> Which printer would you like to use? </label>
          <b-form-select id="selectPrinter" v-model="printer" :options="printers"></b-form-select>
        </p>
        <p>
          <label for="barcode"> Please scan the barcode </label>
          <b-form-input id="barcode" v-model="barcode" type="text"></b-form-input>
        </p>
        <p>
          <label for="text"> Please provide some text to go on the label </label>
          <b-form-input id="text" v-model="text" type="text"></b-form-input>
        </p>
        <p class="text-right">
          <b-button
            id="printLabels"
            class="container-fluid"
            size="lg"
            variant="primary"
            :disabled="isBusy || !isValid"
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
        return config.public.printers.split(',')
      },
    },
  },
  data() {
    return {
      printer: this.printers[0],
      barcode: '',
      text: '',
    }
  },
  computed: {
    isBusy() {
      return this.$refs.statusAlert?.isBusy
    },
    isValid() {
      return this.barcode.length > 0 && this.text.length > 0
    },
  },
  methods: {
    async printLabels() {
      this.$refs.statusAlert.setStatus('Busy', 'Printing labels…')

      const response = await sprintGeneralLabels.printLabels({
        labelFields: [{ barcode: this.barcode, text: this.text }],
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
