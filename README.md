# smart-queue

A smart queue provides the abstraction of a queue that can operate in the following modes:
- `drop`: a fixed-size queue that drops new elements when the queue is full
- `overwrite`: a fixed-size queue that overwrites old elements when the queue is full
- `grow`: a queue that grows in size to accommodate more elements

## usage

```
const {create} = require('smart-queue')
const dropQueue = create({size: 100, strategy: 'drop'})
const overwriteQueue = create({size: 100, strategy: 'overwrite'})
const growQueue = create({size: 100, strategy: 'overwrite'})

for (let i = 0; i < 100; i++) {
  assert(dropQueue.enqueue(i))
  assert(overwriteQueue.enqueue(i))
  assert(growQueue.enqueue(i))
}

// A drop-strategy queue will fail to enqueue items when the queue is full
assert(dropQueue.enqueue(101) === false)
assert(dropQueue.dequeue() === 0)

// An overwrite-strategy queue will succeed in enqueuing items when the queue is full, but will
assert(overwriteQueue.enqueue(101) === true)
assert(overwriteQueue.dequeue() === 1)

// A grow-strategy queue will continue to enqueue items as long as memory is available
assert(overwriteQueue.enqueue(101) === true)
assert(overwriteQueue.dequeue() === 0)
```
