const Transform = require('stream').Transform

class LengthPrefixEncoder extends Transform {
  constructor() {
    super({ writableObjectMode: true })
  }

  _transform(chunk, _encoding, cb) {
    const lenBuffer = new Buffer(2)
    lenBuffer.writeUInt16BE(chunk.length, 0)
    this.push(lenBuffer)
    this.push(chunk)
    return cb(null)
  }
}

exports.LengthPrefixEncoder = LengthPrefixEncoder
