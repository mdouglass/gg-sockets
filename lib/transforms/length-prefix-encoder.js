const Transform = require('stream').Transform

class LengthPrefixEncoder extends Transform {
  constructor() {
    super({ writableObjectMode: true })
  }

  _transform(chunk, _encoding, cb) {
    const lenBuffer = new Buffer(4)
    lenBuffer.writeUInt32LE(chunk.length, 0)
    this.push(lenBuffer)
    this.push(chunk)
    return cb(null)
  }
}

exports.LengthPrefixEncoder = LengthPrefixEncoder
