const BufferList = require('bl')
const Transform = require('stream').Transform

class LengthPrefixDecoder extends Transform {
  constructor() {
    super({ readableObjectMode: true })
    this._bl = new BufferList()
  }

  _transform(chunk, _encoding, cb) {
    this._bl.append(chunk)

    while (this._bl.length >= 2) {
      const len = this._bl.readUInt16BE(0)
      if (this._bl.length >= 2 + len) {
        const msg = this._bl.slice(2, 2 + len)
        this._bl.consume(2 + len)
        this.push(msg)
      } else {
        break
      }
    }

    return cb(null)
  }
}

exports.LengthPrefixDecoder = LengthPrefixDecoder
