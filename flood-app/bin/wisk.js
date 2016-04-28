module.exports = [{
  watch: { paths: 'assets/javascripts/core' },
  tasks: [{ command: './bin/build-js-core' }]
}, {
  watch: { paths: 'assets/javascripts/home' },
  tasks: [{ command: './bin/build-js-home' }]
}, {
  watch: { paths: 'assets/javascripts/warnings' },
  tasks: [{ command: './bin/build-js-warnings' }]
}, {
  watch: { paths: 'assets/javascripts/map' },
  tasks: [{ command: './bin/build-js-map' }]
}, {
  watch: { paths: 'assets/javascripts/river-levels' },
  tasks: [{ command: './bin/build-js-riverlevels' }]
}, {
  watch: { paths: 'assets/javascripts/station' },
  tasks: [{ command: './bin/build-js-station' }]
}, {
  watch: { paths: 'assets/javascripts/stations-overview' },
  tasks: [{ command: './bin/build-js-stationsoverview' }]
}, {
  watch: { paths: 'assets/sass' },
  tasks: [{ command: 'npm', args: ['run', 'build:css'] }]
}]
