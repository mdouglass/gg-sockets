'use strict'
const Transform = require('stream').Transform

class JSONDecoder extends Transform {
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true })
  }

  _transform(chunk, _encoding, cb) {
    try {
      return cb(null, JSON.parse(chunk.toString('utf8')))
    } catch (e) {
      return cb(e)
    }
  }
}

exports.JSONDecoder = JSONDecoder
