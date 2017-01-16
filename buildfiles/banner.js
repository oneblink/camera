'use strict'

function devBanner (pkg) {
  return `/*
 * ${pkg.name}: v${pkg.version}
 * ${pkg.homepage}
 *
 * Copyright ${new Date(Date.now()).getFullYear()} BlinkMobile
 * Released under the ${pkg.license} license
 *
 * ${pkg.description}
 */
`
}

function prodBanner(pkg) {
 return `/*
 * ${pkg.name}: v${pkg.version} | ${pkg.homepage}
 * (c) ${new Date(Date.now()).getFullYear()} BlinkMobile | Released under the ${pkg.license} license
 */
`
}

module.exports = {devBanner, prodBanner}
