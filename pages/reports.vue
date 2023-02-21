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
        <!-- TODO: DPL-561 - better in a component of its own? -->
        <p>
          <b-alert v-model="isError" variant="danger">
            {{ alertMessage }}
          </b-alert>
          <b-alert v-model="isSuccess" variant="success">
            {{ alertMessage }}
          </b-alert>
          <b-alert v-model="isBusy" variant="warning">
            {{ alertMessage }}
          </b-alert>
        </p>
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
import lighthouse from '@/modules/lighthouse_service'
import statuses from '@/modules/statuses'

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
      status: statuses.Idle,
      alertMessage: '',
      items: [],
    }
  },
  computed: {
    reportsToDelete() {
      return this.items.filter((item) => item.toDelete === true).map((item) => item.filename)
    },
    // TODO: DPL-561 - abstract and create functions dynamically.
    isIdle() {
      return this.status === statuses.Idle
    },
    isSuccess() {
      return this.status === statuses.Success
    },
    isError() {
      return this.status === statuses.Error
    },
    isBusy() {
      return this.status === statuses.Busy
    },
  },
  created() {
    this.provider()
  },
  methods: {
    async reportsProvider() {
      const response = await lighthouse.getReports()
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
      const response = await lighthouse.createReport(this.$config)
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
      const response = await lighthouse.deleteReports(this.reportsToDelete)

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
      this.status = statuses[status]
      this.alertMessage = message
    },
  },
}
</script>