<template>
  <b-container>
    <b-row>
      <b-col>
        <PrintLabelsRouter />
        <h1>Print source plate labels</h1>
        <p class="lead"></p>
        <StatusAlert ref="statusAlert" />
        <form enctype="multipart/form-data" method="post" action="#" @submit.prevent="upload">
          <div class="form-group">
            <div class="form-group">
              <label for="selectPrinter">Which printer would you like to use?</label>
              <b-form-select
                id="selectPrinter"
                v-model="printer"
                :options="printers"
              ></b-form-select>
            </div>
            <label for="file-input">Select a file to upload</label>
            <input
              id="file-input"
              ref="fileInput"
              type="file"
              name="file-input"
              class="file"
              @change.prevent="addFilenames"
            />
            <div class="input-group">
              <input
                ref="browseFiles"
                class="form-control"
                type="text"
                disabled
                placeholder="Upload File..."
              />
              <span class="input-group-btn">
                <button
                  class="btn btn-secondary spacer rounded-0 rounded-end"
                  type="button"
                  @click.prevent="browseFiles"
                >
                  Browse
                </button>
              </span>
            </div>
          </div>
        </form>
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
import Sprint from '@/modules/sprint_general_labels'
import CSV from '@/modules/csv'
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
        // TODO: GPL-828-2 - Can we get this list from SPrint instead of setting it in config
        return config.printers.split(',')
      },
    },
  },
  data() {
    return {
      printer: this.printers[0],
      filename: null,
    }
  },
  computed: {
    isBusy() {
      return this.$refs.statusAlert?.isBusy
    },
  },
  methods: {
    async printLabels() {
      if (this.filename == null) {
        this.$refs.statusAlert.setStatus('Error', 'Please upload a file')
        return
      }

      this.$refs.statusAlert.setStatus('Busy', 'Printing labels…')

      const file = this.getFile()
      const read = await CSV.read(file)
      const labelFields = CSV.parse(read)
      const response = await Sprint.printLabels({
        labelFields,
        printer: this.printer,
      })

      if (response.success) {
        this.$refs.statusAlert.setStatus('Success', response.message)
      } else {
        this.$refs.statusAlert.setStatus('Error', response.error)
      }
    },
    browseFiles() {
      this.$refs.fileInput.click()
    },
    getFile() {
      return document.getElementById('file-input').files[0]
    },
    addFilenames() {
      this.filename = this.$refs.fileInput.value
      this.$refs.browseFiles.value = this.filename
    },
  },
}
</script>

<style>
.file {
  visibility: hidden;
  position: absolute;
}
</style>
