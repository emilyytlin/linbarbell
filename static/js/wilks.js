(function(global) {
  'use strict';
  var Wilks = function(unit, sex, bw, s, b, d, total, wilks) {
    var self = this;
    this.unit = ko.observable(unit);
    this.sex = ko.observable(sex);
    this.bw = ko.observable(bw);
    this.squat = ko.observable(s);
    this.bench = ko.observable(b);
    this.deadlift = ko.observable(d);
    this.total = ko.observable(total);
    this.wilks = ko.observable(wilks);
    this.prettyInput = ko.pureComputed(function() {
      var end = self.total() + ' ' + self.unit() + ' @ ' + self.bw() + ' ' + self.unit();
      var s = self.squat() ? self.squat() : 0;
      var b = self.bench() ? self.bench() : 0;
      var d = self.deadlift() ? self.deadlift() : 0;
      return s || b || d
        ? '(' + self.sex() + ') ' + s + ' + ' + b + ' + ' + d + ' = ' + end
        : '(' + self.sex() + ') ' + end;
    });
  };

  var WilksViewModel = function() {
    this.wilks = new Wilks('kg', 'F');
    this.results = ko.observableArray();
  };

  var round = function(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  };

  WilksViewModel.prototype.calculate = function() {
    if (!this.wilks.bw() || !(this.wilks.total() || this.wilks.squat() || this.wilks.bench() || this.wilks.deadlift())) return;
    var total = 0;
    if (this.wilks.squat()) total += this.wilks.squat() * 1;
    if (this.wilks.bench()) total += this.wilks.bench() * 1;
    if (this.wilks.deadlift()) total += this.wilks.deadlift() * 1;
    if (this.wilks.total() && total && this.wilks.total() != total) {
      alert('y u put two different totals pls fix');
      return;
    }
    total = total === 0 ? this.wilks.total() : total;
    var kglb = 2.2046226218;
    var m = { 'a': -216.0475144, 'b': 16.2606339, 'c': -0.002388645, 'd': -0.00113732, 'e': 7.01863E-06, 'f': -1.291E-08};
    var f = {'a': 594.31747775582, 'b': -27.23842536447, 'c': 0.82112226871, 'd': -0.00930733913, 'e': 4.731582E-05, 'f': -9.054E-08 };
    var c = this.wilks.sex() === 'F' ? f : m;
    var bwKg = this.wilks.unit() === 'kg' ? this.wilks.bw() : this.wilks.bw() / kglb;
    var totalKg = this.wilks.unit() === 'kg' ? total : total / kglb;
    var wilks = 500 * totalKg / (c.a + c.b * bwKg + c.c * Math.pow(bwKg, 2) + c.d * Math.pow(bwKg, 3) + c.e * Math.pow(bwKg, 4) + c.f * Math.pow(bwKg, 5));
    this.wilks.wilks(round(wilks, 2));
    this.results.unshift(new Wilks(this.wilks.unit(), this.wilks.sex(), this.wilks.bw(), this.wilks.squat(), this.wilks.bench(), this.wilks.deadlift(), total, this.wilks.wilks()));
  };

  ko.applyBindings(new WilksViewModel());
})(this);