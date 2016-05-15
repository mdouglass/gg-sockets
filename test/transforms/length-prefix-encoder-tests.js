const LengthPrefixEncoder = require('.').LengthPrefixEncoder

describe('LengthPrefixEncoder', () => {
  it('has no outputs if there is no input', () => {
    const t = new LengthPrefixEncoder()
    expect(t.read()).equals(null)
  })

  it('outputs length-prefixed messages for the input', () => {
    const t = new LengthPrefixEncoder()
    t.write('ABC')
    expect(t.read()).deep.equals(Buffer.from([ 0x03, 0x00, 0x00, 0x00, 0x41, 0x42, 0x43 ]))
  })

  it('outputs length-prefixed messages for multiple outputs', () => {
    const t = new LengthPrefixEncoder()
    t.write('ABC')
    t.write('DEF')
    expect(t.read()).deep.equals(Buffer.from([ 0x03, 0x00, 0x00, 0x00, 0x41, 0x42, 0x43, 0x03, 0x00, 0x00, 0x00, 0x44, 0x45, 0x46 ]))
    expect(t.read()).equals(null)
  })
})
