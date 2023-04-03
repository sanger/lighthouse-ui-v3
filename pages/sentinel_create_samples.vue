<template>
  <b-container>
    <h1 class="mt-3">Sentinel Sample Creation</h1>
    <p class="lead">Creates samples in Sequencescape from the fit to pick samples</p>
    <AlertDialog ref="alert"></AlertDialog>

    <div class="card">
      <div class="card-body">
        <div class="form-group row">
          <label for="box-barcode" class="col-sm-4 col-form-label">
            Please scan Lighthouse box barcode
            <p class="text-danger">
              Box and its contents need to be in LabWhere to autogenerate samples in Sequencescape
            </p>
          </label>
          <div class="col-sm-8">
            <b-form-input
              id="box-barcode"
              v-model="boxBarcode"
              type="text"
              class="form-control"
              name="box-barcode"
              @keypress.enter="handleSentinelSampleCreation()"
            />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-12">
            <b-button
              id="handleSentinelSampleCreation"
              variant="primary"
              class="float-end"
              :disabled="submitDisabled"
              @click="handleSentinelSampleCreation()"
              >Submit
            </b-button>
            <b-button
              id="cancelSearch"
              variant="outline-secondary"
              class="float-end"
              @click="cancelSearch()"
              >Cancel
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <br />
    <h3>Samples created</h3>

    <b-table
      id="samples-table"
      v-model:sort-by="sortBy"
      v-model:sort-desc="sortDesc"
      show-empty
      responsive
      :items="items"
      :fields="fields"
      hover
    >
    </b-table>
  </b-container>
</template>

<script>
import AlertDialog from '@/components/AlertDialog'

export default {
  components: {
    AlertDialog,
  },
  data() {
    return {
      fields: [
        { key: 'plate_barcode', label: 'Plate barcode', sortable: true },
        { key: 'centre', label: 'Lighthouse', sortable: true },
        {
          key: 'count_fit_to_pick_samples',
          label: 'Created fit to pick count',
          sortable: true,
        },
      ],
      sortBy: 'plate_barcode',
      sortDesc: true,
      boxBarcode: '',
      items: [],
      isCreating: false,
    }
  },
  computed: {
    submitDisabled() {
      return this.isCreating || this.boxBarcode.length === 0
    },
  },
  methods: {
    async handleSentinelSampleCreation() {
      if (this.submitDisabled) {
        return
      }

      this.isCreating = true
      const resp = await api.createSamples(this.boxBarcode)
      this.handleSentinelSampleCreationResponse(resp)
      this.isCreating = false
    },
    // TODO: DPL-561 - make this more javascripty? destructuring?
    handleSentinelSampleCreationResponse(resp) {
      const errored = resp.filter((obj) => Object.keys(obj).includes('errors'))
      const successful = resp.filter((obj) => Object.keys(obj).includes('data'))
      if (successful.length > 0) {
        this.items = successful.map((obj) => obj.data).map((obj) => obj.data)
      } else {
        this.items = []
      }
      this.sentinelSampleCreationAlert(errored, successful)
    },
    sentinelSampleCreationAlert(errored, successful) {
      const msg = errored.map((e) => e.errors.join(', ')).join(', ')
      if (errored.length > 0 && successful.length > 0) {
        this.showAlert(`Some samples were successfully created however: ${msg}`, 'warning')
      } else if (errored.length > 0 && successful.length === 0) {
        this.showAlert(msg, 'danger')
      } else if (errored.length === 0 && successful.length > 0) {
        this.showAlert('Sentinel samples successfully created in sequencescape', 'success')
      }
    },
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
    cancelSearch() {
      this.boxBarcode = ''
    },
  },
}
</script>

<style scoped>
form {
  padding: 10px;
  min-height: 160px;
}
button {
  margin-right: 5px;
}
</style>
