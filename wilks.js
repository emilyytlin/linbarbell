(function(global) {
  'use strict';
  var Wilks = function(unit, sex, bw, total, wilks) {
    this.unit = ko.observable(unit);
    this.sex = ko.observable(sex);
    this.bw = ko.observable(bw);
    this.total = ko.observable(total);
    this.wilks = ko.observable(wilks);
  };

  var WilksViewModel = function() {
    this.wilks = new Wilks('kg', 'F');
    this.results = ko.observableArray();
  };

  var round = function(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  };

  WilksViewModel.prototype.calculate = function() {
    if (!this.wilks.bw() || !this.wilks.total()) return;
    var kglb = 2.2046226218;
    var m = { 'a': -216.0475144, 'b': 16.2606339, 'c': -0.002388645, 'd': -0.00113732, 'e': 7.01863E-06, 'f': -1.291E-08};
    var f = {'a': 594.31747775582, 'b': -27.23842536447, 'c': 0.82112226871, 'd': -0.00930733913, 'e': 4.731582E-05, 'f': -9.054E-08 };
    var c = this.wilks.sex() === 'F' ? f : m;
    var bwKg = this.wilks.unit() === 'kg' ? this.wilks.bw() : this.wilks.bw() / kglb;
    var totalKg = this.wilks.unit() === 'kg' ? this.wilks.total() : this.wilks.total() / kglb;
    var wilks = 500 * totalKg / (c.a + c.b * bwKg + c.c * Math.pow(bwKg, 2) + c.d * Math.pow(bwKg, 3) + c.e * Math.pow(bwKg, 4) + c.f * Math.pow(bwKg, 5));
    this.wilks.wilks(round(wilks, 2));
    this.results.unshift(new Wilks(this.wilks.unit(), this.wilks.sex(), this.wilks.bw(), this.wilks.total(), this.wilks.wilks()));
  };

  ko.applyBindings(new WilksViewModel());
})(this);