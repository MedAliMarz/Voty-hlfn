import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';
import { ElectionService } from 'src/app/services/election.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit,OnDestroy {
  themeSubscription:any;
  data:any;
  options:any;
  ended:boolean = false;
  timerData:string='loading';
  timerMessage:string ='';
  loading:Boolean;
  // charts data and options
  dataPie:any;optionsPie:any;
  dataBar:any;optionsBar:any;
  dataLine:any;optionsLine:any;
  dataMultiple:any;optionsMultiple:any;
  dataBarHorizontal:any;optionsBarHorizontal:any;
  dataRadar:any;optionsRadar:any;

  constructor(private theme:NbThemeService,
    private electionService:ElectionService,) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadResult()
    
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
 
  initPie(labels,data):void{
    console.log('labels,data', labels,data)
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
    const chartjs: any = config.variables.chartjs;
    this.dataPie = {
      labels: labels,
      datasets: [{
        data: data,
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
    });
    
  }
  initBar():void{
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
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
  })}
  initLine():void{
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
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
  })}
  initMultiple():void{
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
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
  })}
  initBarHorizontal():void{
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
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
  })}
  initRadar():void{
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
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
    };})
  }
  private random() {
    return Math.round(Math.random() * 100);
  }
  initTimer(date){
    var countDownDate = new Date(date).getTime();

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
      this.timerData =  days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    if (distance < 0) {
        clearInterval(x);
        this.timerData = "Election Phase Has Ended!";
        this.timerMessage ='';
        this.ended = true;
    }
    // Display the result in the element with id="demo"
    
    // If the count down is finished, write some text
    
    }, 1000);
  }

  loadResult(){
    let electionId = JSON.parse(localStorage.getItem('loggedUser')).electionId
    this.electionService.getStanding(electionId)
      .subscribe(result=>{
        this.initTimer(result['election'].voting_endDate)
        this.ended = Date.parse(result['election'].voting_endDate) < Date.now()
        console.log("has ended ? ",this.ended);
        
        if(this.ended && result['candidates']){
          console.log("here in the final state")
          let candidates = result['candidates'].sort((v1,v2)=> v1.votes - v2.votes)
          let votes_number =candidates.map(voter=>voter.votes).reduce((a,b)=>a+b,0)
          let voters_number = result['election'].votersNumber
          this.timerMessage = `${votes_number} / ${voters_number} Have voted !`
          this.initPie(
            candidates.map(voter=>`${voter.firstName} ${voter.lastName}`),
            candidates.map(candidate=>candidate.votes),
            )
            
        }else{
          this.timerMessage = `${result['votes']} / ${result['election'].votersNumber} Have voted !`
        }
        this.loading = false;
      },
      error=>{
        console.log("Error in loading election")
        this.timerData = "A problem has occured please refresh the page"
        this.loading = false;
      })
  }
}
