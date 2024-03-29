<template>
  <b-container>
    <b-row>
      <b-col>
        <h1 class="mt-3">Fit to Pick Samples Reports</h1>
        <p class="lead">
          Reports generated for Lighthouse samples which meet the fit to pick rules and are on site
        </p>
        <p>
          <b-button
            id="createReport"
            class="me-1"
            variant="success"
            :disabled="isBusy"
            @click="createReport"
          >
            Create report
            <b-spinner v-show="isBusy" small></b-spinner>
          </b-button>
          <b-button class="me-1" variant="primary" :disabled="isBusy" @click="refreshTable"
            >Refresh</b-button
          >
          <b-button id="deleteReports" variant="danger" :disabled="isBusy" @click="deleteReports">
            Delete Reports
          </b-button>
        </p>
        <StatusAlert ref="statusAlert" />
        <b-table
          ref="reports_table"
          :items="items"
          :fields="fields"
          sort-icon-left
          no-provider-sorting
        >
          <!-- A virtual column -->
          <template #cell(index)="data">{{ data.index + 1 }}</template>
          <template #cell(download_link)="data">
            <b-button variant="primary" :href="data.item.download_url" download>
              Download
            </b-button>
          </template>
          <template #cell(delete)="data">
            <b-form-group class="selected">
              <input v-model="data.item.toDelete" type="checkbox" />
            </b-form-group>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        // A virtual column that doesn't exist in items
        { key: 'index', label: '' },
        'filename',
        'size',
        { key: 'download_link', label: '' },
        'delete',
      ],
      items: [],
    }
  },
  computed: {
    reportsToDelete() {
      return this.items.filter((item) => item.toDelete === true).map((item) => item.filename)
    },
    isBusy() {
      return this.$refs.statusAlert?.isBusy
    },
  },
  created() {
    this.provider()
  },
  methods: {
    async reportsProvider() {
      const response = await lighthouseService.getReports()
      if (response.success) {
        const reports = response.reports.map((report) => ({
          ...report,
          toDelete: false,
        }))
        return reports
      } else {
        return []
      }
    },
    async createReport() {
      this.setStatus(
        'Busy',
        'Report creation takes about 30s to complete, please do not refresh the page'
      )
      const response = await lighthouseService.createReport(this.$config)
      if (response.success) {
        this.setStatus('Success', 'Report successfully created')
        this.refreshTable()
      } else {
        this.setStatus('Error', 'There was an error creating the report')
      }
    },
    async deleteReports() {
      if (this.reportsToDelete.length === 0) return
      this.setStatus('Busy', 'Deleting reports ...')
      const response = await lighthouseService.deleteReports(this.reportsToDelete)

      if (response.success) {
        this.setStatus('Success', 'Reports successfully deleted')
        this.refreshTable()
      } else {
        this.setStatus('Error', response.error)
      }
    },
    refreshTable() {
      this.provider()
    },
    async provider() {
      this.items = await this.reportsProvider()
      this.items.sort((a, b) => b.filename.localeCompare(a.filename)) // Inverse sort by filename
    },
    setStatus(status, message) {
      this.$refs.statusAlert.setStatus(status, message)
    },
  },
}
</script>
