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
$("#slider").slider({
  min: 0,
  max: 4, 
  step: 1,
  slide: function(event, ui) {
    var session = ui.value;
    switch(ui.value) {
       case 0:
         session = {name:"110th", years:"2007-2009", billCount:"14,042"};
         break;
       case 1:
         session = {name:"111th", years:"2009-2011", billCount:"13,675"};
         break;
       case 2:
         session = {name:"112th", years:"2011-2013", billCount:"12,299"};
         break;
       case 3:
         session = {name:"113th", years:"2013-2015", billCount:"10,637"};
         break;
       case 4:
         session = {name:"114th", years:"2015-2017", billCount:"11,644"};
         break;
    }
    $("#sessionName").html(session.name + " Congress?");
    $(".rsize").html(session.years);
    $("#billCount").html(session.billCount + " bills")
  }
});