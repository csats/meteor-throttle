# csats:throttle

[![Build Status](https://travis-ci.org/csats/meteor-throttle.svg?branch=master)](https://travis-ci.org/csats/meteor-throttle)

Simple, generic, durable, **server-side only** rate-limiter for Meteor
applications. Durable because counters are stored in MongoDB. This durability
generally makes it unsuitable for throttling high-traffic services (especially
if oplog tailing is in use).

`Throttle` is exported.

## Install

Add this package to your Meteor application with

    meteor add csats:throttle

## Test

Run tests with

    npm test

## API

The API is as follows. First, define your "throttle config": a small JavaScript
object with

1. An "operation" string. This is used as a key to decide what is throttled.
2. A "max" number: how many of this exact operation can occur before further
   operations are throttled.
3. A "period" momentjs.Duration instance: how far back to look when summing
   throttle-able operations.

Example config for limiting something named 'recalculate stats' to 2 operations
per hour:

    var config = {
      operation: 'recalculate stats',
      max: 2,
      period: momentjs.duration(1, 'hour')
    };

First, create your rate limiter:

    var throttle = new Throttle(config);

Every time (for example) "stats are recalculated", you would call

    throttle.up();

For convenience, the return value of `up()` is a boolean indicating whether or
not this call to `up()` put you over the threshold you defined. You can also
see if you're still below the rate limit threshold _without_ throttling up via

    throttle.isBelow();

To reset the rate limit counter, call:

    throttle.reset();

This might be useful if you need to forcibly reset the counter before the
period expires.

Rate limit counters are durable (stored in MongoDB), so you'll probably want

    throttle.expireStale();

A scheduled job can use this method to automatically clean up stale resources
used for rate limiting (for example: old `_csats_throttles` MongoDB documents).

# Copyright

(C)2015 C-SATS, Inc.

# License

MIT. See COPYING.
