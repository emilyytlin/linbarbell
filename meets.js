'use strict';
var headers = ['Date', 'Fed', 'Name', 'Weight', 'Squat', '', '', 'Bench', '', '', 'Deadlift', '', '', 'Total', 'Wilks'];
var ctx = document.getElementById("wilks");
var wilksChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3]
    }]
  },
  options: { // i h8 animations
    hover: { 
      animationDuration: 0
    },
    animation: {
      duration: 0
    },
    responsiveAnimationDuration: 0
  }
});

var ViewModel = function() {
  var self = this;
  this.unit = ko.observable('kg');
  this.data = ko.observableArray([]);
  $.ajax({
    type: 'GET',
    url: 'resources/meets.csv',
    dataType: 'text'
  }).done(function(meets) {
    self.data($.csv.toObjects(meets));
  });
};
ko.applyBindings(new ViewModel());