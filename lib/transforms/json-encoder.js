const Transform = require('stream').Transform

class JSONEncoder extends Transform {
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true })
  }

  _transform(chunk, _encoding, cb) {
    return cb(null, Buffer.from(JSON.stringify(chunk), 'utf8'))
  }
}

exports.JSONEncoder = JSONEncoder
