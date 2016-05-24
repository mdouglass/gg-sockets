'use strict'
const logger = require('gg-logger').facility(__filename, 'debug')
const transforms = require('./transforms')
const events = require('events')
const net = require('net')

function pipeline(streams) {
  for (let i = 0; i < streams.length - 1; ++i)
    streams[i].pipe(streams[i + 1])
}

function writePipeline(streams) {
  pipeline(streams)
  return streams[0]
}

function readPipeline(streams) {
  pipeline(streams)
  return streams[streams.length - 1]
}

function forwardEvent(source, target, event) {
  source.on(event, (...args) => target.emit(event, ...args))
}

class Connection extends events.EventEmitter {
  constructor(socket) {
    super()
    this._socket = socket
    forwardEvent(this._socket, this, 'close')
    forwardEvent(this._socket, this, 'end')
    forwardEvent(this._socket, this, 'error')
    forwardEvent(this._socket, this, 'timeout')

    this._writeStream = writePipeline([
      new transforms.JSONEncoder(),
      new transforms.LengthPrefixEncoder(),
      this._socket
    ])
    this._readStream = readPipeline([
      this._socket,
      new transforms.LengthPrefixDecoder(),
      new transforms.JSONDecoder()
    ])

    this._readStream.on('data', this._onStreamData.bind(this))
    this._readStream.on('error', this._onStreamError.bind(this))

    Reflect.defineProperty(this, '_socket', { enumerable: false })
    Reflect.defineProperty(this, '_writeStream', { enumerable: false })
    Reflect.defineProperty(this, '_readStream', { enumerable: false })
  }

  address() {
    return this._socket.address()
  }

  write(data) {
    return this._writeStream.write(data)
  }

  end(data, encoding) {
    this._socket.end(data, encoding)
  }

  _onStreamData(data) {
    try {
      this.emit('data', data)
    } catch (e) {
      this._onStreamError(e)
    }
  }

  _onStreamError(e) {
    try {
      this.emit('error', e)
    } catch (error) {
      logger.error('Error while handling connection error', error)
    }
    this._socket.end()
  }
}

class Server extends events.EventEmitter {
  constructor(...args) {
    super()
    this._server = new net.Server(...args)
    forwardEvent(this._server, this, 'close')
    forwardEvent(this._server, this, 'error')
    forwardEvent(this._server, this, 'listening')
    this._server.on('connection', this._onConnection.bind(this))
  }

  address() {
    return this._server.address()
  }

  listen(...args) {
    this._server.listen(...args)
  }

  close(callback) {
    this._server.close(callback)
  }

  _onConnection(socket) {
    this.emit('connection', new Connection(socket))
  }
}

exports.Server = Server
