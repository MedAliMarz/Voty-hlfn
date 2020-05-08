import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit,OnDestroy {
  themeSubscription:any;
  data:any;
  options:any;
  isAdmin:boolean = false;
  timerData:string='oupa ';
  dataPie:any;optionsPie:any;
  dataBar:any;optionsBar:any;
  dataLine:any;optionsLine:any;
  dataMultiple:any;optionsMultiple:any;
  dataBarHorizontal:any;optionsBarHorizontal:any;
  dataRadar:any;optionsRadar:any;

  constructor(private theme:NbThemeService) { }

  ngOnInit(): void {
    this.initTimer();
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      console.log(config)
      this.initPie(config)
      this.initBar(config)
      this.initLine(config)
      this.initMultiple(config)
      this.initBarHorizontal(config)
      this.initRadar(config)
      
    });
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
  initPie(config):void{
    const colors: any = config.variables;
    const chartjs: any = config.variables.chartjs;
    this.dataPie = {
      labels: ['Download Sales', 'In-Store Sales', 'Mail Sales'],
      datasets: [{
        data: [300, 500, 100],
        backgroundColor: [colors.primaryLight, colors.infoLight, colors.successLight],
      }],
    };
    this.optionsPie = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [
          {
            display: false,
          },
        ],
        yAxes: [
          {
            display: false,
          },
        ],
      },
      legend: {
        labels: {
          fontColor: colors.fg,
        },
      },
    };
  }
  initBar(config):void{
    const colors: any = config.variables;
    const chartjs: any = config.variables.chartjs;
    this.dataBar = {
      labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
      datasets: [{
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: NbColorHelper.hexToRgbA(colors.primaryLight, 0.8),
      }, {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Series B',
        backgroundColor: NbColorHelper.hexToRgbA(colors.infoLight, 0.8),
      }],
    };

    this.optionsBar = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        labels: {
          fontColor: colors.fg,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
              color: colors.separator
            },
            ticks: {
              fontColor: colors.fg,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: colors.separator
            },
            ticks: {
              fontColor: colors.fg,
            },
          },
        ],
      },
    };
  }
  initLine(config):void{
    const colors: any = config.variables;
    const chartjs: any = config.variables.chartjs;
    this.dataLine = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
        borderColor: colors.primary,
      },
      ],
    };

    this.optionsLine = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
              color: colors.separator
            },
            ticks: {
              fontColor: colors.fg,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: colors.separator
            },
            ticks: {
              fontColor: colors.fg,
            },
          },
        ],
      },
      legend: {
        labels: {
          fontColor: colors.fg,
        },
      },
    };
  }
  initMultiple(config):void{
    const colors: any = config.variables;
    const chartjs: any = config.variables.chartjs;
    this.dataMultiple = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [{
        label: 'dataset - big points',
        data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        fill: false,
        borderDash: [5, 5],
        pointRadius: 8,
        pointHoverRadius: 10,
      }, {
        label: 'dataset - individual point sizes',
        data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
        borderColor: colors.dangerLight,
        backgroundColor: colors.dangerLight,
        fill: false,
        borderDash: [5, 5],
        pointRadius: 8,
        pointHoverRadius: 10,
      }, {
        label: 'dataset - large pointHoverRadius',
        data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
        borderColor: colors.info,
        backgroundColor: colors.info,
        fill: false,
        pointRadius: 8,
        pointHoverRadius: 10,
      }, {
        label: 'dataset - large pointHitRadius',
        data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
        borderColor: colors.success,
        backgroundColor: colors.success,
        fill: false,
        pointRadius: 8,
        pointHoverRadius: 10,
      }],
    };

    this.optionsMultiple = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        labels: {
          fontColor: colors.fg,
        },
      },
      hover: {
        mode: 'index',
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Month',
            },
            gridLines: {
              display: true,
              color: colors.separator
            },
            ticks: {
              fontColor: colors.fg,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value',
            },
            gridLines: {
              display: true,
              color: colors.separator
            },
            ticks: {
              fontColor: colors.fg,
            },
          },
        ],
      },
    };
  }
  initBarHorizontal(config):void{
    const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
    this.dataBarHorizontal = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [{
          label: 'Dataset 1',
          backgroundColor: colors.infoLight,
          
          data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
        },
      ],
    };

    this.optionsBarHorizontal = {
      responsive: true, 
      maintainAspectRatio: false,
      elements: {
        rectangle: {
          borderWidth: 2,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
              color: colors.separator
            },
            ticks: {
              fontColor: colors.fg,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
              color: colors.separator
            },
            ticks: {
              fontColor: colors.fg,
            },
          },
        ],
      },
      legend: {
        position: 'right',
        labels: {
          fontColor: colors.fg,
        },
      },
    };
  }
  initRadar(config):void{
    const colors: any = config.variables;
    const chartjs: any = config.variables.chartjs;
    this.dataRadar = {
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
      datasets: [{
        data: [65, 59, 90, 81, 56, 55, 40],
        label: 'Series A',
        borderColor: colors.danger,
        backgroundColor: NbColorHelper.hexToRgbA(colors.dangerLight, 0.5),
      }, {
        data: [28, 48, 40, 19, 96, 27, 100],
        label: 'Series B',
        borderColor: colors.warning,
        backgroundColor: NbColorHelper.hexToRgbA(colors.warningLight, 0.5),
      }],
    };

    this.optionsRadar = {
      responsive: true,
      maintainAspectRatio: false,
      scaleFontColor: 'white',
      legend: {
        labels: {
          fontColor: colors.fg,
        },
      },
      scale: {
        pointLabels: {
          fontSize: 14,
          fontColor: colors.fg,
        },
        gridLines: {
          color: colors.separator
        },
        angleLines: {
          color: colors.separator
        },
      },
    };
  }
  private random() {
    return Math.round(Math.random() * 100);
  }
  initTimer(){
    console.log('in timer init')
    var countDownDate = new Date("May 6, 2020 19:15:00").getTime();

// Update the count down every 1 second
    var x = setInterval(() => {
    // Get today's date and time
      var now = new Date().getTime();

    // Find the distance between now and the count down date
      var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    this.timerData =  days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        this.timerData = "Has Ended!";
      }
    }, 1000);
  }
}
