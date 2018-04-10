# smart-queue

[![node (scoped)](https://img.shields.io/node/v/@anandsuresh/smart-queue.svg?style=plastic)](https://nodejs.org/en/download/)
[![npm (scoped)](https://img.shields.io/npm/v/@anandsuresh/smart-queue.svg?style=plastic)](https://www.npmjs.com/package/@anandsuresh/smart-queue)
[![npm](https://img.shields.io/npm/dt/@anandsuresh/smart-queue.svg?style=plastic)](https://www.npmjs.com/package/@anandsuresh/smart-queue)
[![Travis](https://img.shields.io/travis/anandsuresh/smart-queue.svg?style=plastic)](https://travis-ci.org/anandsuresh/smart-queue)
[![license](https://img.shields.io/github/license/anandsuresh/smart-queue.svg?style=plastic)](LICENSE)
[![GitHub followers](https://img.shields.io/github/followers/anandsuresh.svg?style=social&label=Follow)](https://github.com/anandsuresh)
[![Twitter Follow](https://img.shields.io/twitter/follow/anandsuresh.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=anandsuresh)

A smart queue provides the abstraction of a queue that can operate in the following modes:
- `drop`: a fixed-size queue that drops new elements when the queue is full
- `overwrite`: a fixed-size queue that overwrites old elements when the queue is full
- `grow`: a queue that grows in size to accommodate more elements

## usage

```
const {create} = require('smart-queue')

const dropQueue      = create({size: 100, strategy: 'drop'})
const overwriteQueue = create({size: 100, strategy: 'overwrite'})
const growQueue      = create({size: 100, strategy: 'grow'})

for (let i = 0; i < 100; i++) {
  assert(dropQueue.enqueue(i))
  assert(overwriteQueue.enqueue(i))
  assert(growQueue.enqueue(i))
}

// A drop-strategy queue will fail to enqueue items when the queue is full
assert(dropQueue.enqueue(101) === false)
assert(dropQueue.dequeue() === 0)

// An overwrite-strategy queue will succeed in enqueuing items when the queue is full, but will overwrite the oldest element
assert(overwriteQueue.enqueue(101) === true)
assert(overwriteQueue.dequeue() === 1)

// A grow-strategy queue will continue to enqueue items as long as memory is available
assert(growQueue.enqueue(101) === true)
assert(growQueue.dequeue() === 0)
```
