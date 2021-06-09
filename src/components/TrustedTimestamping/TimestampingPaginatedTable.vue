<template lang="pug">
div.row
  div.col-12
    card(card-body-classes="table-full-width" no-footer-line)
      template(v-slot:header)
        h4.card-title Timestamped Files

      div
        div.col-12.d-flex.justify-content-center.justify-content-sm-between.flex-wrap  
          div.ml-auto
            fg-input
              el-input(
                type="search"
                class="mb-3"
                clearable
                prefix-icon="el-icon-search"
                style="width: 200px"
                placeholder="Search records"
                v-model="searchQuery"
                aria-controls="datatables"
              )
  
        el-table(stripe style="width: 100%" :data="queriedData")
          el-table-column(
            v-for="column in tableColumns"
            :key="column.label"
            :min-width="column.minWidth"
            :prop="column.prop"
            :label="column.label"
          )
          
          el-table-column(fixed="right" label="Actions")
            template(v-slot:default="props")
              div.d-flex.justify-content-center.table-actions
                n-button(
                  @click="handleCopy(props.$index, props.row)"
                  type="info"
                  size="sm"
                  round
                  icon
                )
                  i.fa.fa-copy
        
      template(v-slot:footer)
        div.col-12.d-flex.align-items-center.justify-content-center
          div
            p.card-category Showing {{ from + 1 }} to {{ to }} of {{ total }} entries

          div.ml-auto.d-flex.align-items-center
            el-select.select-primary.mb-3.w-50(
              v-model="pagination.perPage"
              placeholder="Per page"
            )
              el-option.select-default(
                v-for="item in pagination.perPageOptions"
                :key="item"
                :label="item"
                :value="item"
              )
              
            n-pagination.pagination-no-border(
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="total"
            )
</template>
<script>
import { mapState } from "vuex";
import { ElTable, ElTableColumn, ElSelect, ElOption } from "element-plus";
import { Pagination as NPagination } from "@/components";

export default {
  components: {
    NPagination,
    [ElSelect.name]: ElSelect,
    [ElOption.name]: ElOption,
    [ElTable.name]: ElTable,
    [ElTableColumn.name]: ElTableColumn,
  },

  data() {
    return {
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0,
      },
      searchQuery: "",
      propsToSearch: ["name", "hash"],
      tableColumns: [
        {
          prop: "name",
          label: "Name",
          minWidth: 250,
        },
        {
          prop: "hash",
          label: "Hash",
          minWidth: 250,
        },
        {
          prop: "timestamp",
          label: "Timestamp",
          minWidth: 200,
        },
      ],
      searchedData: [],
      fuseSearch: null,
    };
  },

  computed: {
    ...mapState({
      hashes: (state) => state.trustedTimestamping.hashes || [],
    }),

    pagedData() {
      return (this.hashes || []).slice(this.from, this.to);
    },

    /***
     * Searches through table data and returns a paginated array.
     * Note that this should not be used for table with a lot of data as it might be slow!
     * Do the search and the pagination on the server and display the data retrieved from server instead.
     * @returns {computed.pagedData}
     */
    queriedData() {
      if (!this.searchQuery) {
        return this.pagedData;
      }
      let result = this.hashes.filter((row) => {
        let isIncluded = false;
        for (let key of this.propsToSearch) {
          let rowValue = row[key].toString();
          if (rowValue.includes && rowValue.includes(this.searchQuery)) {
            isIncluded = true;
          }
        }
        return isIncluded;
      });

      return (result || []).slice(this.from, this.to);
    },

    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },

    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },

    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.hashes.length;
    },
  },

  methods: {
    handleCopy(index, row) {},
  },
};
</script>
<style></style>
