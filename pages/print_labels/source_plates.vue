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
              <button class="btn btn-secondary spacer" type="button" @click.prevent="browseFiles">
                Browse
              </button>
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
      const csvRead = await csv.read(file)

      if (!csvRead.success) {
        this.$refs.statusAlert.setStatus('Error', csvRead.error)
        return
      }

      const csvParse = csv.parse(csvRead.data)

      if (!csvParse.success) {
        this.$refs.statusAlert.setStatus('Error', csvParse.error)
        return
      }

      const response = await sprintGeneralLabels.printLabels({
        labelFields: csvParse.data,
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
