<template>
  <b-container>
    <b-row>
      <b-col>
        <PrintLabelsRouter />
        <h1>Print reagent aliquot labels</h1>
        <p class="lead"></p>
        <StatusAlert ref="statusAlert" />
        <p>
          <img src="@/assets/images/reagent_aliquot_label_preview.png" />
        </p>
        <p>
          <label for="selectPrinter">Which printer would you like to use?</label>
          <b-form-select id="selectPrinter" v-model="printer" :options="printers"></b-form-select>
        </p>
        <p>
          <label for="firstLineText">Freeform first line of text:</label>
          <b-form-input id="firstLineText" v-model="firstLineText" type="text"></b-form-input>
        </p>
        <p>
          <label for="secondLineText">Freeform second line of text:</label>
          <b-form-input id="secondLineText" v-model="secondLineText" type="text"></b-form-input>
        </p>
        <p>
          <label for="barcode">Scan or enter an aliquot barcode:</label>
          <b-form-input id="barcode" v-model="barcode" type="text"></b-form-input>
        </p>
        <p>
          <label for="numberOfLabels">Quantity of labels needed:</label>
          <b-form-input
            id="numberOfLabels"
            v-model="numberOfLabelsString"
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
      firstLineText: '',
      secondLineText: '',
      barcode: '',
      numberOfLabelsString: '1',
    }
  },
  computed: {
    numberOfLabels() {
      return parseInt(this.numberOfLabelsString)
    },
    isBusy() {
      return this.$refs.statusAlert?.isBusy
    },
    isValid() {
      return (
        this.barcode.length > 0 &&
        this.firstLineText.length > 0 &&
        this.numberOfLabels >= 1 &&
        this.numberOfLabels <= 100
      )
    },
  },
  methods: {
    async printLabels() {
      this.$refs.statusAlert.setStatus('Busy', 'Printing labels…')

      const response = await sprintReagentAliquotLabels({
        barcode: this.barcode,
        firstText: this.firstLineText,
        secondText: this.secondLineText,
        printer: this.printer,
        quantity: this.numberOfLabels,
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
