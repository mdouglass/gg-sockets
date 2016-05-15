const BufferList = require('bl')
const Transform = require('stream').Transform

class LengthPrefixDecoder extends Transform {
  constructor() {
    super({ readableObjectMode: true })
    this._bl = new BufferList()
  }

  _transform(chunk, _encoding, cb) {
    this._bl.append(chunk)

    while (this._bl.length >= 4) {
      const len = this._bl.readUInt32LE(0)
      if (this._bl.length >= 4 + len) {
        const msg = this._bl.slice(4, 4 + len)
        this._bl.consume(4 + len)
        this.push(msg)
      } else {
        break
      }
    }

    return cb(null)
  }
}

exports.LengthPrefixDecoder = LengthPrefixDecoder
