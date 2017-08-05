(function() {
  'use strict';
  var MeetsViewModel = function() {
    var self = this;
    this.kglb = 2.2046226218;
    this.unit = ko.observable('kg');
    this.resultsKg = ko.observableArray([]);
    this.resultsLb = ko.observableArray([]);
    this.results = ko.computed(function() { return self.unit() === 'kg' ? self.resultsKg() : self.resultsLb()});
    this.labels = [];
    this.datasetsKg = [];
    this.datasetsLb = [];
    $.get('../meets.csv').done(function(meets) {
      self.resultsKg($.csv.toObjects(meets));
      self.parseResults();
      self.drawChart();
      self.unit.subscribe(function(value) {
        self.drawChart();
      });
    });
  };

  MeetsViewModel.prototype.parseResults = function() {
    var self = this;
    var sKgs = [], bKgs = [], dKgs = [], totalKgs = [], sLbs = [], bLbs = [], dLbs = [], totalLbs = [], wilks = [];
    var pushData = function(kgs, lbs, kg) {
      kgs.push(kg);
      lbs.push(kg * self.kglb);
    };
    var pushDatasets = function(id, type, label, dataKg, dataLb, color) {
      self.datasetsKg.push({ yAxisID: id, type: type, label: label, data: dataKg, fill: false, backgroundColor: color, borderColor: color });
      self.datasetsLb.push({ yAxisID: id, type: type, label: label, data: dataLb, fill: false, backgroundColor: color, borderColor: color });
    };
    var round = function(value, decimals) {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    };
    this.resultsKg().forEach(function(result) {
      self.labels.push(result.Date);
      pushData(sKgs, sLbs, Math.max(result.Squat1, result.Squat2, result.Squat3));
      pushData(bKgs, bLbs, Math.max(result.Bench1, result.Bench2, result.Bench3));
      pushData(dKgs, dLbs, Math.max(result.Deadlift1, result.Deadlift2, result.Deadlift3));
      pushData(totalKgs, totalLbs, result.Total);
      wilks.push(result.Wilks);
      self.resultsLb.push({
        Link: result.Link,
        Date: result.Date,
        Federation: result.Federation,
        Name: result.Name,
        Weight: round(result.Weight * self.kglb, 1),
        Squat1: round(result.Squat1 * self.kglb, 1),
        Squat2: round(result.Squat2 * self.kglb, 1),
        Squat3: round(result.Squat3 * self.kglb, 1),
        Bench1: round(result.Bench1 * self.kglb, 1),
        Bench2: round(result.Bench2 * self.kglb, 1),
        Bench3: round(result.Bench3 * self.kglb, 1),
        Deadlift1: round(result.Deadlift1 * self.kglb, 1),
        Deadlift2: round(result.Deadlift2 * self.kglb, 1),
        Deadlift3: round(result.Deadlift3 * self.kglb, 1),
        Total: round(result.Total * self.kglb, 1),
        Wilks: result.Wilks,
      });
    });
    pushDatasets('weight', 'bar', 'Squat', sKgs, sLbs, '#2E5266');
    pushDatasets('weight', 'bar', 'Bench', bKgs, bLbs, '#FF5964');
    pushDatasets('weight', 'bar', 'Deadlift', dKgs, dLbs, '#843B62');
    pushDatasets('weight', 'line', 'Total', totalKgs, totalLbs, '#B7C8B5');
    pushDatasets('wilks', 'line', 'Wilks', wilks, wilks, '#35A7FF');
  };

  MeetsViewModel.prototype.drawChart = function() {
    var self = this;
    if (this.wilksChart) this.wilksChart.destroy();
    var ctx = document.getElementById('wilks');
    this.wilksChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: self.labels,
        datasets: self.unit() === 'kg' ? self.datasetsKg : self.datasetsLb
      },
      options: {
        scales: { 
          xAxes: [{ stacked: true }],
          yAxes: [
            { stacked: true, id: 'weight', position: 'left', scaleLabel: { display: true, labelString: self.unit() } },
            { stacked: true, id: 'wilks', position: 'right', scaleLabel: { display: true, labelString: 'wilks' } }
          ]
        },
        responsive: true,
        maintainAspectRatio: false,
        hover: { animationDuration: 0 },
        animation: { duration: 0 },
        responsiveAnimationDuration: 0
      }
    });
  };
  ko.applyBindings(new MeetsViewModel());
})(this);