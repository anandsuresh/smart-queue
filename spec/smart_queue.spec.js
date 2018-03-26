/**
 * @file Unit tests for the smart queue
 *
 * @author Anand Suresh <anandsuresh@gmail.com>
 * @copyright Copyright (C) 2018-present Anand Suresh. All rights reserved.
 */

const {expect} = require('chai')
const SmartQueue = require('../lib/smart_queue')

describe('SmartQueue', () => {
  it('api', () => {
    expect(SmartQueue).to.be.an('object')
    expect(SmartQueue.create).to.be.a('function')
  })

  describe('strategy', () => {
    describe('drop', () => {
      it('should enqueue new data when space is available', () => {
        const queue = SmartQueue.create({size: 1, strategy: 'drop'})
        expect(queue.enqueue({foo: 'bar'})).to.equal(true)
        expect(queue.length).to.equal(1)
      })

      it('should not enqueue new data when space is not available', () => {
        const queue = SmartQueue.create({size: 1, strategy: 'drop'})
        expect(queue.enqueue({foo: 'bar'})).to.equal(true)
        expect(queue.enqueue({bar: 'baz'})).to.equal(false)
        expect(queue.length).to.equal(1)
      })

      it('should dequeue data when available', () => {
        const queue = SmartQueue.create({size: 1, strategy: 'drop'})
        expect(queue.enqueue({foo: 'bar'})).to.equal(true)
        expect(queue.dequeue()).to.deep.equal({foo: 'bar'})
        expect(queue.length).to.equal(0)
      })

      it('should not dequeue data when not available', () => {
        const queue = SmartQueue.create({size: 1, strategy: 'drop'})
        expect(queue.enqueue({foo: 'bar'})).to.equal(true)
        expect(queue.dequeue()).to.deep.equal({foo: 'bar'})
        expect(queue.dequeue()).to.equal(undefined)
        expect(queue.length).to.equal(0)
      })
    })

    describe('overwrite', () => {
      it('should enqueue new data when space is available', () => {
        const queue = SmartQueue.create({size: 1, strategy: 'overwrite'})
        expect(queue.enqueue({foo: 'bar'})).to.equal(true)
        expect(queue.length).to.equal(1)
      })

      it('should enqueue new data when space is not available', () => {
        const queue = SmartQueue.create({size: 2, strategy: 'overwrite'})
        expect(queue.enqueue({foo: 'bar'})).to.equal(true)
        expect(queue.length).to.equal(1)
        expect(queue.enqueue({bar: 'baz'})).to.equal(true)
        expect(queue.length).to.equal(2)
        expect(queue.enqueue({baz: 'foo'})).to.equal(true)
        expect(queue.length).to.equal(2)

        expect(queue.dequeue()).to.deep.equal({bar: 'baz'})
        expect(queue.length).to.equal(1)
        expect(queue.dequeue()).to.deep.equal({baz: 'foo'})
        expect(queue.length).to.equal(0)
      })

      it('should dequeue data when available', () => {
        const queue = SmartQueue.create({size: 1, strategy: 'overwrite'})
        expect(queue.enqueue({foo: 'bar'})).to.equal(true)
        expect(queue.dequeue()).to.deep.equal({foo: 'bar'})
        expect(queue.length).to.equal(0)
      })

      it('should not dequeue data when not available', () => {
        const queue = SmartQueue.create({size: 1, strategy: 'overwrite'})
        expect(queue.enqueue({foo: 'bar'})).to.equal(true)
        expect(queue.dequeue()).to.deep.equal({foo: 'bar'})
        expect(queue.dequeue()).to.equal(undefined)
        expect(queue.length).to.equal(0)
      })
    })

    describe('grow', () => {
      it('should enqueue data as long as there is memory available (64Mb heap usage)', function () {
        this.timeout(30000)

        const queue = SmartQueue.create()
        do {
          queue.enqueue(Math.random())
        } while (process.memoryUsage().heapUsed < 1024 * 1024 * 64)
      })
    })
  })
})
