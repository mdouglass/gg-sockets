global.expect = require('chai').expect

const path = require('path')
const Module = require('module')
const resolveFilenameOld = Module._resolveFilename

resolveFilenameHook.marker = 'arbitrary string'
function resolveFilenameHook(request, parent, isMain) {
  try {
    return resolveFilenameOld(request, parent, isMain)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND')
      throw e

    const parentDir = path.dirname(parent.filename)
    const relativeParentDir = path.relative(__dirname, parentDir)
    const requestRewritten = path.join(
      __dirname,
      '../lib',
      relativeParentDir,
      request
    )
    return resolveFilenameOld(requestRewritten, parent, isMain)
  }
}

if (resolveFilenameOld.marker !== resolveFilenameHook.marker)
  Module._resolveFilename = resolveFilenameHook
