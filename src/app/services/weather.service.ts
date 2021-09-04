import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}
    urlWeather = "https://api.openweathermap.org/data/2.5/weather"
    tokenId = "a871408c3647cb59b80b33387d8a0c67";
    urlWeek = "https://api.openweathermap.org/data/2.5/onecall"
    
    getAll(city: string) {
       return this.http.get<any>(this.urlWeather+'?q='+city+'&appid='+this.tokenId+'&units=metric');
    }

    getWeek(lat:any, long:any){
      return this.http.get<any>(this.urlWeek+'?lat='+lat+'&lon='+long+'&appid='+this.tokenId+'&units=metric');
    }

   


}