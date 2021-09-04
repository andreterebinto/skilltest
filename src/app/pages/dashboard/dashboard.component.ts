import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cities } from 'src/app/model/cities';
import { Weather } from 'src/app/model/weather';
import { Wind } from 'src/app/model/wind';
import { WeatherService } from 'src/app/services/weather.service';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import * as olControl from 'ol/control';
import Vector from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

declare var am4core: any;
declare var am4charts: any;
declare var am4themes_animated: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  constructor(private router: Router, private weatherServices: WeatherService) {}
  
  cities = new Array();
  citySelected: any;
  today: any;
  weather = new Weather();
  wind = new Wind();
  map: any;
  lat = -25.504;
  long = -49.2908;

  ngOnInit(){
    am4core.useTheme(am4themes_animated);
    this.initMap(this.long, this.lat);
    let data = [
      { name: "Sao Paulo", id: "Sao Paulo"},
      { name: "Curitiba", id: "Curitiba"},
      { name: "Orlando", id: "Orlando"},
      { name: "Miami", id: "Miami"},
      { name: "London", id: "London"}
      
    ]
    this.cities = data;
    this.today =  new Date().toLocaleDateString();
    this.citySelected = this.cities[0]["id"];
    this.getWeather(this.citySelected)

    
  }

  sair(){
    localStorage.removeItem("userTest");
    this.router.navigate(['/login']);
  }

  changeCity(){
    this.getWeather(this.citySelected)
  }

  getWeather(city:string){
    this.weatherServices.getAll(city).pipe().subscribe(data =>{
      //retorno dos dados da API
      this.weather = data["main"];
      this.wind = data["wind"];
      this.lat = data["coord"]["lat"];
      this.long = data["coord"]["lon"];
      
      //Montanto a posição do mapa
      if (this.map){
        this.map.setView(new View({
          center: olProj.fromLonLat([this.long, this.lat]),
          zoom: 8
        }))
        //criando a layer PIN
        var layer = new VectorLayer({
          source: new Vector({
              features: [
                  new Feature({
                      geometry: new Point(olProj.fromLonLat([this.long, this.lat]))
                  })
              ]
          })
        });
        //Adicionando a layer dentro do mapa
        this.map.addLayer(layer);
        //montando o gráfico conforme resultado da API
        this.mountDash(data["main"])
        //montando o grafico dos ultimos 7 dias
        this.getUrlWeek(this.lat, this.long);
      }
      
    }, error => {
      alert("Error")
    })
  }

  getUrlWeek(lat:any, long:any){
    this.weatherServices.getWeek(lat,long).pipe().subscribe(data =>{
      this.mountDashWeek(data["daily"]);
    }, error => {
      alert("Error")
    })
  }


  initMap(lat: number, long: number) {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      controls : olControl.defaults({
        attribution : false,
        zoom : false,
      }),
      view: new View({
        center: olProj.fromLonLat([lat, long]),
        zoom: 18
      })
    });

    

 


    
  }

  mountDash(dataWeather: any){
    
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.data = [ {
      "measure": "Temperatura",
      "total": dataWeather.temp
    }, {
      "measure": "Mínima",
      "total": dataWeather.temp_min
    }, {
      "measure": "Máxima",
      "total": dataWeather.temp_max
    }, {
      "measure": "Sensação",
      "total": dataWeather.feels_like
    }];

    chart.padding(40, 40, 40, 40);

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "measure";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "measure";
    series.dataFields.valueY = "total";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = -10;
    labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
    chart.zoomOutButton.disabled = true;
    series.columns.template.adapter.add("fill", function (fill:any, target:any) {
    return chart.colors.getIndex(target.dataItem.index);
    });
  }

  mountDashWeek(days: any){
   
    var chart = am4core.create("chartdivWeek", am4charts.XYChart);
    chart.paddingRight = 20;

    var data = [];
   
    for (var i = 0; i < days.length; i++) {
      var date = new Date(days[i].dt * 1000);
      data.push({ date: date, value: days[i].temp.day });
    }

    chart.data = data;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;


    // this makes the data to be grouped
    dateAxis.groupData = false;
    dateAxis.groupCount = 500;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

  }

}
