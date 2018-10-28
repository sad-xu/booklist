// const RequireMap = require('@pihachu/require-map')

const RequireMap = require('require-map')
const requireMap = new RequireMap('app.js')
requireMap.run()