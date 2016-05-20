'use strict'
const LengthPrefixDecoder = require('.').LengthPrefixDecoder

describe('LengthPrefixDecoder', () => {
  it('has no outputs if there is no input', () => {
    const t = new LengthPrefixDecoder()
    expect(t.read()).equals(null)
  })

  it('has no outputs if the input is an incomplete length', () => {
    const t = new LengthPrefixDecoder()
    t.write(Buffer.from([ 0x00, 0x00, 0x01 ]))
    expect(t.read()).equals(null)
  })

  it('has no outputs if the input is complete length and an incomplete message', () => {
    const t = new LengthPrefixDecoder()
    t.write(Buffer.from([ 0x00, 0x00, 0x00, 0x01 ]))
    expect(t.read()).equals(null)
  })

  it('outputs the message if the input is a complete message', () => {
    const t = new LengthPrefixDecoder()
    t.write(Buffer.from([ 0x01, 0x00, 0x00, 0x00, 0x65 ]))
    expect(t.read()).deep.equals(Buffer.from([ 0x65 ]))
  })

  it('outputs multiple message if the input is multiple messages', () => {
    const t = new LengthPrefixDecoder()
    t.write(Buffer.from([ 0x01, 0x00, 0x00, 0x00, 0x65, 0x02, 0x00, 0x00, 0x00, 0x66, 0x67 ]))
    expect(t.read()).deep.equals(Buffer.from([ 0x65 ]))
    expect(t.read()).deep.equals(Buffer.from([ 0x66, 0x67 ]))
  })

  it('outputs message that is reassembled from multiple inputs', () => {
    const t = new LengthPrefixDecoder()
    t.write(Buffer.from([ 0x01 ]))
    t.write(Buffer.from([ 0x00 ]))
    t.write(Buffer.from([ 0x00 ]))
    t.write(Buffer.from([ 0x00 ]))
    t.write(Buffer.from([ 0x65 ]))
    expect(t.read()).deep.equals(Buffer.from([ 0x65 ]))
  })
})
