/* global $ */

require('datatables.net')(window, $)

function stationsOverviewPage (options) {
  $('#stations').DataTable({
    initComplete: function () {
      this.api().columns().every(function () {
        var column = this
        var select = $('<select><option value=""></option></select>')
          .appendTo($(column.header()).empty())
          .on('change', function () {
            var val = $.fn.dataTable.util.escapeRegex(
              $(this).val()
            )
            column
              .search(val ? '^' + val + '$' : '', true, false)
              .draw()
          })

        column.data().unique().sort().each(function (d, j) {
          select.append('<option value="' + d + '">' + d + '</option>')
        })
      })
    }
  })
}

module.exports = stationsOverviewPage
