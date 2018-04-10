/**
 * @file An implementation of a smart queue
 *
 * @author Anand Suresh <anandsuresh@gmail.com>
 * @copyright Copyright (C) 2018-present Anand Suresh. All rights reserved.
 */

const {EventEmitter} = require('events')

/**
 * A list of strategies when enqueuing on a full queue
 * @type {Array}
 */
const STRATEGIES = ['drop', 'overwrite', 'grow']

/**
 * An implementation of a smart stream
 * @extends {EventEmitter}
 * @type {SmartQueue}
 */
class SmartQueue extends EventEmitter {
  /**
   * Implements a smart queue data structure
   *
   * @param {Object} [props] Properties of the queue
   * @param {Number} [props.size] The size of the queue
   * @param {String} [props.strategy='grow'] The strategy to use when enqueuing on a full queue
   * @return {SmartQueue}
   */
  constructor (props) {
    props = Object.assign({size: Infinity, strategy: 'grow'}, props)

    if (STRATEGIES.indexOf(props.strategy) < 0) {
      throw new TypeError(`unknown strategy "${props.strategy}"!`)
    }

    if (props.strategy === 'grow') {
      props.size = Infinity
    } else if (props.size == null || isNaN(props.size) || props.size <= 0) {
      throw new TypeError(`invalid size (${props.size})!`)
    }

    super()

    this._props = props = Object.assign(props, {
      data: (props.size === Infinity) ? [] : new Array(props.size),
      head: 0,
      tail: -1,
      length: 0
    })
  }

  /**
   * Returns whether or not the queue has data
   * @name {SmartQueue#hasData}
   * @type {Boolean}
   */
  get hasData () {
    return this.length > 0
  }

  /**
   * Returns the number of elements in the queue
   * @name {SmartQueue#length}
   * @type {Number}
   */
  get length () {
    return this._props.length
  }

  /**
   * Returns the size of the queue
   * @name {SmartQueue#size}
   * @type {Number}
   */
  get size () {
    return this._props.size
  }

  /**
   * Enqueues data in the queue
   *
   * @param {*} data The data to be enqueued
   * @return {Boolean} true, if the data was successfully enqueued; false otherwise
   */
  enqueue (data) {
    const props = this._props

    if (props.length < props.size) {
      props.data[props.head] = data
      props.head = (props.head + 1) % props.size
      props.length++
      return true
    }

    switch (props.strategy) {
      case 'drop':
        return false

      case 'overwrite':
        props.data[props.head] = data
        props.head = (props.head + 1) % props.size
        props.tail = (props.tail + 1) % props.size
        return true

      case 'grow': // For sake of clarity/completeness
        throw new Error('this is really really bad! all bets are off!')

      default:
        throw new TypeError(`unknown strategy "${props.strategy}"`)
    }
  }

  /**
   * Dequeue's data from the queue
   *
   * @return {*|undefined} The data that was dequeue'd, if any; undefined otherwise
   */
  dequeue () {
    const props = this._props

    if (props.length === 0) {
      return
    }

    props.tail = (props.tail + 1) % props.size
    const data = props.data[props.tail]
    props.data[props.tail] = undefined
    props.length--
    return data
  }
}

/**
 * Creates a SmartQueue
 *
 * @param {Object} [props] Properties of the queue
 * @param {Number} [props.size] The size of the queue
 * @param {String} [props.strategy='grow'] The strategy to use when enqueuing on a full queue
 * @return {SmartQueue}
 */
function create (props) {
  return new SmartQueue(props)
}

/**
 * Export the interface
 * @type {Object}
 */
module.exports = {create}
