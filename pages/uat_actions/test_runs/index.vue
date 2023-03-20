<template>
  <b-container>
    <UATActionsRouter />

    <h1 class="mt-3">UAT Actions</h1>

    <AlertDialog id="alert" ref="alert"></AlertDialog>

    <b-table striped hover :fields="fields" :items="testRuns">
      <template #cell(actions)="row">
        <b-button
          :id="'viewTestRun-' + row.item._id"
          :to="'/uat_actions/test_runs/' + row.item._id"
          variant="primary"
          :disabled="!isRunViewable(row)"
          >View</b-button
        >
      </template>
    </b-table>

    <div class="clearfix">
      <span v-if="totalRows" class="fw-bold float-end">Total: {{ totalRows }}</span>
    </div>

    <b-pagination
      v-if="totalRows"
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      align="center"
    ></b-pagination>
  </b-container>
</template>

<script>
import AlertDialog from '@/components/AlertDialog'
import UATActionsRouter from '@/components/UATActionsRouter'
export default {
  name: 'TestRuns',
  components: {
    AlertDialog,
    UATActionsRouter,
  },
  data() {
    return {
      fields: [
        {
          key: '_created',
          class: 'align-middle',
        },
        {
          key: 'status',
          class: 'align-middle',
        },
        {
          key: 'total_plates',
          class: 'align-middle',
        },
        'actions',
      ],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      testRuns: [],
    }
  },
  watch: {
    currentPage() {
      this.refresh()
    },
    perPage() {
      this.refresh()
    },
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      const showError = (message) => {
        this.totalRows = 0
        this.testRuns = []
        this.$refs.alert.show(message, 'danger')
      }

      let response

      try {
        response = await lighthouseService.getTestRuns(this.currentPage, this.perPage)
      } catch (error) {
        showError('An unknown error has occurred')
        return
      }

      if (response.success) {
        this.totalRows = response.total
        this.testRuns = [...response.response]
      } else {
        showError(response.error)
      }
    },
    isRunViewable(row) {
      // the status is always updated in Crawler to either failed or completed
      // pending means that Crawler hasn't even touched this run
      return row.item.status === 'completed' || row.item.status === 'failed'
    },
  },
}
</script>

<style scoped lang="scss"></style>
