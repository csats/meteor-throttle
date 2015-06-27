'use strict';

var Throttles = new Mongo.Collection('_csats_throttles');

/* global Throttle:true */
Throttle = class Throttle {
  constructor (config) {
    check(config, {operation: String, max: Number, period: Match.Any});
    if (!moment.isDuration(config.period)) {
      throw new Meteor.Error('period must be a momentjs Duration object');
    }
    this.config = config;
  }

  static _parsePeriod (period, referenceDate) {
    if (!moment.isDuration(period)) {
      throw new Meteor.Error('period must be a momentjs Duration object');
    }
    check(referenceDate, Date);
    return moment(referenceDate).subtract(period).toDate();
  }

  isBelow () {
    const sinceDateTime = Throttle._parsePeriod(this.config.period, new Date());
    const count = Throttles.find({
      operation: this.config.operation,
      createdAt: { $gt: sinceDateTime }
    }).count();
    if (count < this.config.max) {
      return true;
    }
    return false;
  }

  up () {
    Throttles.insert({
      operation: this.config.operation,
      createdAt: new Date(),
      staleAfter: moment().add(this.config.period).toDate()
    });
    return this.isBelow();
  }

  reset () {
    const selector = {operation: this.config.operation};
    Throttles.remove(selector);
  }

  /**
   * Expire stale resources used for throttling.
   */
  expireStale () {
    Throttles.remove({
      staleAfter: {$lt: new Date()}
    });
  }
};
