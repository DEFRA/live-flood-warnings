/* global $ */

function WarningsPage (options) {
  options = $.extend(true, {
    isLocalised: false
  }, options)

  var $warnings = $('ul.warnings-list')
  var hash = window.location.hash

  /*
   * Warnings filtering
   */
  function hiliter (str, element) {
    var regex = new RegExp(str, 'gi')
    element.html(element.html().replace(regex, function (matched) {
      return '<mark>' + matched + '</mark>'
    }))
  }

  function filterChange (form) {
    var $form = $(form)
    var $filter = $(form.filter)

    // Get the trimmed filter text
    var val = $filter.val().trim()

    // Lookup the DOM to find the details panel
    // that this filter input is contained within
    var $panel = $form.closest('details.details-severity')

    // Get all the notifications contained in the panel
    var $notifications = $panel.find('details.details-notification')

    // Unhighlight any previously highlighted text
    $notifications.find('summary > span > mark').contents().unwrap()

    // Loop through all the notifications
    $notifications.each(function () {
      var $notification = $(this)
      var $title = $notification.find('summary > span')

      // Rejoin any split text to tidy up the DOM text node
      $title.get(0).normalize()

      // If there's no value to filter on, show the notification
      if (!val) {
        $notification.show()
      } else {
        // Compare the text node and filter value
        var notificationText = $title.text().toLowerCase()
        var matches = notificationText.indexOf(val.toLowerCase())
        if (matches > -1) {
          // If we hit a match, highlight and show
          hiliter(val, $title)
          $notification.show()
        } else {
          // If we fail to hit a match, hide the notification
          $notification.hide()
        }
      }
    })

    // Show/hide the reset button
    // Enabled/disable the submit button
    var $reset = $form.find('button[type="reset"]')
    var $submit = $form.find('button[type="submit"]')
    if (val) {
      $reset.show()
      $submit.removeAttr('disabled')
    } else {
      $reset.hide()
      $submit.attr('disabled', 'disabled')
    }
  }

  $warnings.on('submit', 'form.filter', function (e) {
    e.preventDefault()
    filterChange(this)
  })

  $warnings.on('input', 'form.filter input', function (e) {
    filterChange(this.form)
  })

  $warnings.on('reset', 'form.filter', function (e) {
    var $filter = $(this.filter)
    $filter.val('')
    filterChange(this)
    $filter.focus()
  })

  // Open the details summary
  // of the `hash` of applicable
  if (hash) {
    var $element = $(hash)
    $element.attr('open', '')
    $element.parents('details').attr('open', '')
  }
}

module.exports = WarningsPage
