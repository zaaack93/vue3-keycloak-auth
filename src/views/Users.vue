<script setup>
import { onMounted, reactive, ref } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import { Dropdown, DropdownContent, DropdownItem, DropdownMenu, DropdownToggle } from '@/global-components/dropdown'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const tableRef = ref()
const tabulator = ref()
const filter = reactive({
  field: '',
  type: '=',
  value: '',
})
const pagination = reactive({
  pageSize: 50,
  skip: 0,
})

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM
const URL = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`

onMounted(() => {
  initTabulator()
})

const initTabulator = () => {
  tabulator.value = new Tabulator(tableRef.value, {
    ajaxURL: URL,
    ajaxConfig: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    },
    ajaxParams: { first: pagination.skip, max: pagination.pageSize },
    ajaxURLGenerator: (url, config, params) => {
      params.max = params.size
      pagination.pageSize = params.max
      params.first = (params.page - 1) * params.size
      pagination.skip = params.first

      let strPagination = ''
      for (const paramsKey in params) {
        if (paramsKey !== 'filter') {
          strPagination += `&${paramsKey}=${params[paramsKey]}`
        }
      }

      let strFilter = ''
      for (const filter of params.filter) {
        if (filter.field === 'cni') {
          strFilter += `q=${filter.field}:${filter.value.toUpperCase()}`
        } else {
          strFilter += `${filter.field}${filter.type}${filter.value}`
        }
      }

      return `${url}?${strFilter}${strPagination}`
    },
    ajaxResponse: async (url, params, response) => {
      const { data } = await axios.get(`${URL}/count`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      })
      const last_page = Math.ceil(+data / pagination.pageSize)
      return { data: response, last_page }
    },
    filterMode: 'remote',
    // sortMode: 'remote',
    printAsHtml: true,
    printStyled: true,
    pagination: true,
    paginationMode: 'remote',
    paginationSize: pagination.pageSize,
    paginationSizeSelector: [
      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 300, 400, 500,
    ],
    layout: 'fitColumns',
    responsiveLayout: 'collapse',
    placeholder: 'No matching records found',
    columns: [
      {
        formatter: 'responsiveCollapse',
        width: 40,
        minWidth: 30,
        hozAlign: 'center',
        resizable: false,
        headerSort: false,
      },
      {
        title: 'CIN',
        field: 'attributes.cni',
        headerHozAlign: 'left',
        vertAlign: 'middle',
        minWidth: 200,
        responsive: 0,
      },
      {
        title: 'Username',
        field: 'username',
        headerHozAlign: 'left',
        vertAlign: 'middle',
        minWidth: 200,
        responsive: 0,
      },
      {
        title: 'First Name',
        field: 'firstName',
        headerHozAlign: 'left',
        vertAlign: 'middle',
        minWidth: 200,
        responsive: 0,
      },
      {
        title: 'Last Name',
        field: 'lastName',
        headerHozAlign: 'left',
        vertAlign: 'middle',
        minWidth: 200,
        responsive: 0,
      },
      // {
      //   title: "Birth Date",
      //   field: "birthDate",
      //   headerHozAlign: "left",
      //   vertAlign: "middle",
      //   minWidth: 200,
      //   responsive: 0,
      // },
      {
        title: 'ACTIONS',
        width: 100,
        responsive: 1,
        headerHozAlign: 'right',
        hozAlign: 'center',
        vertAlign: 'center',
        print: false,
        download: false,
        formatter() {
          const a = dom(`<button class='flex items-center justify-center'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path><path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
                  </svg>
                </button>`)
          dom(a).on('click', function() {
            console.log('edit')
          })

          return a[0]
        },
      },
    ],
  })
}

// Filter function
const onFilter = () => {
  tabulator.value.setFilter(filter.field, filter.type, filter.value)
}

// On reset filter
const onResetFilter = () => {
  filter.field = ''
  filter.type = '='
  filter.value = ''
  onFilter()
}

// Export
const onExportCsv = () => {
  tabulator.value.download('csv', 'data.csv')
}

const onExportJson = () => {
  tabulator.value.download('json', 'data.json')
}

const onExportXlsx = () => {
  // window.XLSX = xlsx;
  // tabulator.value.download("xlsx", "data.xlsx", {
  //   sheetName: "Products",
  // });
}

const onExportHtml = () => {
  tabulator.value.download('html', 'data.html', {
    style: true,
  })
}

// Print
const onPrint = () => {
  tabulator.value.print()
}
</script>

<template>
  <!-- BEGIN: HTML Table Data -->
  <div class='intro-y box p-5 mt-5'>
    <div class='flex flex-col sm:flex-row sm:items-end xl:items-start'>
      <form id='tabulator-html-filter-form' class='xl:flex sm:mr-auto' @submit.prevent='onFilter'>
        <div class='sm:flex items-center sm:mr-4'>
          <!--          <label class='w-12 flex-none xl:w-auto xl:flex-initial mr-2'-->
          <!--          >Search By</label>-->
          <select
            id='tabulator-html-filter-field'
            v-model='filter.field'
            class='form-select w-full sm:w-32 2xl:w-full mt-2 sm:mt-0 sm:w-auto'
          >
            <option hidden disabled value=''>Filter By</option>
            <option value='cni'>CIN</option>
            <option value='search'>Name</option>
          </select>
        </div>
        <div class='sm:flex items-center sm:mr-4 mt-2 xl:mt-0'>
          <label class='w-12 flex-none xl:w-auto xl:flex-initial mr-2'
          >Value</label
          >
          <input
            id='tabulator-html-filter-value'
            v-model='filter.value'
            type='text'
            class='form-control sm:w-40 2xl:w-full mt-2 sm:mt-0'
            placeholder='Search...'
          />
        </div>
        <div class='mt-2 xl:mt-0'>
          <button
            type='submit'
            id='tabulator-html-filter-go'
            class='btn btn-primary w-full sm:w-16'
          >
            Go
          </button>
          <button
            type='button'
            id='tabulator-html-filter-reset'
            class='btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1'
            @click='onResetFilter'
          >
            Reset
          </button>
        </div>
      </form>
      <div class='flex mt-5 sm:mt-0'>
        <button
          id='tabulator-print'
          class='btn btn-outline-secondary w-1/2 sm:w-auto mr-2'
          @click='onPrint'
        >
          <PrinterIcon class='w-4 h-4 mr-2' />
          Print
        </button>
        <Dropdown class='w-1/2 sm:w-auto'>
          <DropdownToggle class='btn btn-outline-secondary w-full sm:w-auto'>
            <FileTextIcon class='w-4 h-4 mr-2' />
            Export
            <ChevronDownIcon class='w-4 h-4 ml-auto sm:ml-2' />
          </DropdownToggle>
          <DropdownMenu class='w-40'>
            <DropdownContent>
              <DropdownItem @click='onExportCsv'>
                <FileTextIcon class='w-4 h-4 mr-2' />
                Export CSV
              </DropdownItem>
              <DropdownItem @click='onExportJson'>
                <FileTextIcon class='w-4 h-4 mr-2' />
                Export JSON
              </DropdownItem>
              <DropdownItem @click='onExportXlsx'>
                <FileTextIcon class='w-4 h-4 mr-2' />
                Export XLSX
              </DropdownItem>
              <DropdownItem @click='onExportHtml'>
                <FileTextIcon class='w-4 h-4 mr-2' />
                Export HTML
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class='overflow-x-auto scrollbar-hidden'>
      <div
        id='tabulator'
        ref='tableRef'
        class='mt-5 table-report table-report--tabulator'
      ></div>
    </div>
  </div>
  <!-- END: HTML Table Data -->
</template>
