<template>
  <b-container>
    <h1 class="mt-3">Imports</h1>
    <p class="lead">
      Import status of CSV files processed by the crawler. Data shown only includes the last 4
      weeks, up to 10,000 results.
    </p>
    <StatusAlert ref="statusAlert" />
    <br />
    <b-form-group
      label="Filter"
      label-cols-sm="1"
      label-align-sm="right"
      label-for="filterInput"
      class="mb-0"
    >
      <b-input-group>
        <b-form-input id="filterInput" v-model="filter" type="search" placeholder="Type to Search">
        </b-form-input>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <br />
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="center"
      aria-table="imports-table"
    ></b-pagination>
    <p>
      <b>Note:</b> Imports shown may be from an SFTP fetch performed each half hour, or they may be
      from messages processed via RabbitMQ. SFTP fetches show the file name, identifiable by the
      inclusion of a file extension. Imports from a RabbitMQ message show the plate barcode.
    </p>
    <b-table
      id="imports-table"
      v-model:sort-by="sortBy"
      v-model:sort-desc="sortDesc"
      show-empty
      responsive
      :items="items"
      :fields="fields"
      :filter="filter"
      :filterable="fields.map((field) => field.key)"
      hover
      :per-page="perPage"
      :current-page="currentPage"
      head-variant="light"
    >
      <template #cell(errors)="row">
        <ul>
          <li v-for="error in row.item.errors" :key="error">
            {{ error }}
          </li>
        </ul>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="center"
      aria-table="imports-table"
    ></b-pagination>
  </b-container>
</template>

<script>
import StatusAlert from '@/components/StatusAlert'

export default {
  components: {
    StatusAlert,
  },
  data() {
    return {
      fields: [
        {
          key: 'date',
          label: 'Date',
          sortable: true,
          formatter: (value) => {
            const d = new Date(value)
            return d.toLocaleString()
          },
          filterByFormatted: true,
        },
        { key: 'centre_name', label: 'Centre', sortable: true },
        { key: 'csv_file_used', label: 'File Name / Plate Barcode', sortable: true },
        { key: 'number_of_records', label: 'Num of records', sortable: true },
        { key: 'errors', label: 'Errors', sortable: true },
      ],
      sortBy: 'date',
      sortDesc: true,
      perPage: 10,
      currentPage: 1,
      items: [],
      filter: '',
    }
  },
  computed: {
    rows() {
      return this.items ? this.items.length : 0
    },
  },
  created() {
    this.provider()
  },
  methods: {
    async getItemsProvider() {
      const resp = await lighthouseService.getImports()
      return this.handleItemsResponse(resp)
    },
    handleItemsResponse(response) {
      if (response.success) {
        return response.data._items
      } else {
        this.$refs.statusAlert.setStatus('Error', response.error)
        return []
      }
    },
    async provider() {
      this.items = await this.getItemsProvider()
    },
  },
}
</script>

<style></style>
