'use strict'
const JSONEncoder = require('.').JSONEncoder

describe('JSONEncoder', () => {
  it('outputs as JSON for encoded objects', () => {
    const t = new JSONEncoder()
    t.write({ foo: 'bar' })
    expect(t.read()).deep.equals(Buffer.from('{"foo":"bar"}'))
  })

  it('outputs multiple buffers for multiple encoded objects', () => {
    const t = new JSONEncoder()
    t.write({ foo: 'bar' })
    t.write({ baz: 42 })
    expect(t.read()).deep.equals(Buffer.from('{"foo":"bar"}'))
    expect(t.read()).deep.equals(Buffer.from('{"baz":42}'))
  })
})
