'use strict'
const JSONDecoder = require('.').JSONDecoder

describe('JSONDecoder', () => {
  it('outputs objects for JSON strings', () => {
    const t = new JSONDecoder()
    t.write('{"foo":"bar"}')
    expect(t.read()).deep.equals({ foo: 'bar' })
  })

  it('outputs multiple objects for multiple encoded strings', () => {
    const t = new JSONDecoder()
    t.write(Buffer.from('{"foo":"bar"}'))
    t.write(Buffer.from('{"baz":42}'))
    expect(t.read()).deep.equals({ foo: 'bar' })
    expect(t.read()).deep.equals({ baz: 42 })
  })
})
