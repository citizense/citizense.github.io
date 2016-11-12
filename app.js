$(function () {

    /*
    TODO:
    - Check data labels after drilling. Label rank? New positions?
    - Not US Mainland text
    - Separators
    */
        window.states = [
          {name:'California', value:5097},
          {name:'Florida', value:22},
          {name:'Texas', value:11356},
          {name:'New York', value:18494},
          {name:'Illinois', value:14173},
          {name:'Virginia', value:347},
          {name:'Pennsylvania', value:5354},
          {name:'Colorado', value:788},
          {name:'Washington', value:4019},
          {name:'Ohio', value:2221},
          {name:'North Carolina', value:2053},
          {name:'New Jersey', value:7670},
          {name:'Georgia', value:4835},
          {name:'Michigan', value:3915},
          {name:'Maryland', value:2832},
          {name:'Arizona', value:1361},
          {name:'Oregon', value:283},
          {name:'Massachusetts', value:7151},
          {name:'Missouri', value:2291},
          {name:'Indiana', value:1116},
          {name:'Tennessee', value:7740},
          {name:'Oklahoma', value:0},
          {name:'Alabama', value:0},
          {name:'Wisconsin', value:2111},
          {name:'Kentucky', value:6452},
          {name:'Minnesota', value:0},
          {name:'South Carolina', value:3872},
          {name:'Louisiana', value:2404},
          {name:'Connecticut', value:1386},
          {name:'Utah', value:821},
          {name:'Nevada', value:1093},
          {name:'Kansas', value:1459},
          {name:'Iowa', value:3055},
          {name:'Arkansas', value:296},
          {name:'Mississppi', value:3216},
          {name:'New Mexico', value:2365},
          {name:'New Hampshire', value:1013},
          {name:'West Virginia', value:2237},
          {name:'Idaho', value:632},
          {name:'Rhode Island', value:2472},
          {name:'Nebraska', value:1841},
          {name:'Hawaii', value:5708},
          {name:'Alaska', value:752},
          {name:'Maine', value:0},
          {name:'Montana', value:1187},
          {name:'Delaware', value:1009},
          {name:'North Dakota', value:940},
          {name:'Vermont', value:1733},
          {name:'South Dakota', value:493},
          {name:'Wyoming', value:200}
        ]

function billCountProperty(s) {
        for (var state in states) {
          var state = states[state]
          if (s.name == state.name) {
            s.value = state.value
            return s.value
          }
      }
    }
    
    
    var data = Highcharts.geojson(Highcharts.maps['countries/us/us-all']),
        // Some responsiveness
        small = $('#container').width() < 400;

    // Set drilldown pointers
    $.each(data, function (i) {
        this.drilldown = this.properties['hc-key'];
        this.value = i; // Non-random bogus dat
        window.state = data[i]
        billCountProperty(window.state);
    });

    // Instanciate the map
    Highcharts.mapChart('container', {
        chart: {
            events: {
                drilldown: function (e) {
                    this.setTitle({text: "Counties in this State"});
                    if (!e.seriesOptions) {
                        var chart = this,
                            mapKey = 'countries/us/' + e.point.drilldown + '-all',
                            // Handle error, the timeout is cleared on success
                            fail = setTimeout(function () {
                                if (!Highcharts.maps[mapKey]) {
                                    chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);

                                    fail = setTimeout(function () {
                                        chart.hideLoading();
                                    }, 1000);
                                }
                            }, 3000);

                        // Show the spinner
                        chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

                        // Load the drilldown map
                        $.getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', function () {

                            data = Highcharts.geojson(Highcharts.maps[mapKey]);

                            // Set a non-random bogus value
                            $.each(data, function (i) {
                                this.value = i;
                            });

                            // Hide loading and add series
                            chart.hideLoading();
                            clearTimeout(fail);
                            chart.addSeriesAsDrilldown(e.point, {
                                name: e.point.name,
                                data: data
                            });
                        });
                    }


                    this.setTitle(null, { text: e.point.name });
                },
                drillup: function () {
                    this.setTitle({text: "Number of Bills in Each State"});
                    this.setTitle(null, { text: 'USA' });
                }
            }
        },

        title: {
              text: 'Number of Bills in Each State',
        },

        subtitle: {
            text: 'USA',
            floating: true,
            align: 'right',
            y: 50,
            style: {
                fontSize: '16px'
            }
        }, 
        colorAxis: {
            min: 0,
            minColor: '#fcf9f4',
            maxColor: '#ffc05b'

        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        plotOptions: {
            map: {
                states: {
                    hover: {
                        color: '#ff9d00'
                    }
                }
            }
        },

        series: [{
            data: data,
            name: 'USA',
//            dataLabels: {
                //enabled: true,
                //format: '{point.properties.postal-code}'
        }],

        drilldown: {
            //series: drilldownSeries,
            activeDataLabelStyle: {
                color: '#FFFFFF',
                textDecoration: 'none',
                textShadow: '0 0 3px #000000'
            },
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    x: 0,
                    y: 60
                }
            }
        }
    });
});

// BILL COUNT SLIDER
window.oneHundred10th = {name:"110th", years:"2007-2009", billCount:"14,042"};
window.oneHundred11th = {name:"111th", years:"2009-2011", billCount:"13,675"};
window.oneHundred12th = {name:"112th", years:"2011-2013", billCount:"12,299"};
window.oneHundred13th = {name:"113th", years:"2013-2015", billCount:"10,637"};
window.oneHundred14th = {name:"114th", years:"2015-2017", billCount:"11,644"};
$("#sessionName").html(oneHundred14th.name + " Congress?");
$(".rsize").html(oneHundred14th.years);
$("#billCount").html(oneHundred14th.billCount + " bills")

$("#sessionName").html();
$("#slider").slider({
  min: 0,
  max: 4, 
  step: 1,
  slide: function(event, ui) {
    var session = ui.value;
    switch(ui.value) {
       case 0:
         session = window.oneHundred10th;
         break;
       case 1:
         session = window.oneHundred11th;
         break;
       case 2:
         session = window.oneHundred12th;
         break;
       case 3:
         session = window.oneHundred13th;
         break;
       case 4:
         session = window.oneHundred14th;
         break;
    }
    $("#sessionName").html(session.name + " Congress?");
    $(".rsize").html(session.years);
    $("#billCount").html(session.billCount + " bills")
  }
});

// D3 MAP

google.load("visualization", "1", {packages:["geochart"]});
google.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  var data = google.visualization.arrayToDataTable([
    ['States', 'Bills'],
    ['CA', 5097],
    ['FL', 22],
    ['TX', 11356],
    ['NY', 18494],
    ['IL', 14173],
    ['VA', 347],
    ['PA', 5354],
    ['CO', 788],
    ['WA', 4019],
    ['OH', 2221],
    ['NC', 2053],
    ['NJ', 7670],
    ['GA', 4835],
    ['MI', 3915],
    ['MD', 2832],
    ['AZ', 1361],
    ['OR', 283],
    ['MA', 7151],
    ['MO', 2291],
    ['IN', 1116],
    ['TN', 7740],
    ['OK', 0],
    ['AL', 0],
    ['WI', 2111],
    ['KY', 6452],
    ['MN', 0],
    ['SC', 3872],
    ['LA', 2404],
    ['CT', 1386],
    ['UT', 821],
    ['NV', 1093],
    ['KS', 1459],
    ['IA', 3055],
    ['AR', 296],
    ['MS', 3216],
    ['NM', 2365],
    ['NH', 1013],
    ['WV', 2237],
    ['ID', 632],
    ['RI', 2472],
    ['NE', 1841],
    ['HI', 5708],
    ['AK', 752],
    ['ME', 0],
    ['MT', 1187],
    ['DC', 0000],
    ['DE', 1009],
    ['ND', 940],
    ['VT', 1733],
    ['SD', 493],
    ['WY', 200]
  ]);


  function billCount(states) {
  }

  var options = {
    colorAxis: {
      colors:['ffffff','e8f1f7','f1f6fa','e3eef5','d5e6f1','c8ddec','bad5e8','accde3','9fc4de','91bcda','83b4d5','76acd1','5f9fc9','4891c2','3183ba','1b76b3','17689d','145987','114a71','0d3c5b'],
      values: [0,50,100,250,500,1000,1500,2000,2500,3000,5000,7500,10000,13000,15000,20000,25000,30000,40000,50000]
    },
    backgroundColor: 'transparent',
    datalessRegionColor: 'silver',
    defaultColor: 'silver',
    legend:'none',
    region: 'US',
    displayMode: 'region',
    resolution: 'provinces'
  };

  function LegiScan() {
    this.legiscanUrl = 'https://api.legiscan.com/?key=77fe81d295a37906c8022fb7353d6dcb&op=getMasterList&state=';
    this.query = window.query;
  }

  LegiScan.prototype.makeRequest = function() {
  $.ajax({
      url: this.legiscanUrl + this.query,
      type: "GET",
      dataType: 'json',
    }).done(function(data){
      window.bills = data;
      var billsList = data.masterlist

      var len = 0;
      for (var o in billsList) {
       len++;
       console.log(len)
      }

      // for (var bill in billsList) {
      //   var bill = billsList[bill]
      //   console.log(bill)
      // }
    });
  }  

  var chart = new google.visualization.GeoChart(document.getElementById('googleMap'));
  chart.draw(data, options);

  google.visualization.events.addListener(chart, 'select', function() {
    var selectedItem = chart.getSelection()[0];
    window.query = data.getValue(selectedItem.row, 0)
    // legiscan = new LegiScan();
    // legiscan.makeRequest();

  })

}
