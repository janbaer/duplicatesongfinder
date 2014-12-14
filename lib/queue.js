'use strict';

var Queue = function () {
  this.queue = [];
};

Queue.prototype.push = function (item) {
  this.queue.push(item);
};

Queue.prototype.pop = function () {
  if (this.queue.length > 0) {
    var item = this.queue[0];
    this.queue = this.queue.slice(1);
    return item;
  }
};

Queue.prototype.isEmpty = function () {
  return this.queue.length === 0;
};

Queue.prototype.canPop = function () {
  return !this.isEmpty();
};

Queue.prototype.count = function () {
  return this.queue.length;
};

module.exports = Queue;
