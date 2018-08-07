import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ICurrentWeather} from '../interfaces'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { map } from 'rxjs/operators'

interface ICurrentWeatherData {

  weather: [
    {
      description: string
      icon: string
    }
  ],
  main: {
    temp: number
  },
  sys: {
    country: string
  },
  dt: number
  name: string

}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private httpClient: HttpClient) {}

  getCurrentWeather(city: string, country: string):Observable<ICurrentWeather> {
    let shape =  this.httpClient.get<ICurrentWeatherData>(
      `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?` + `q=${city},${country}&appid=${environment.appId}`
    ).pipe(
    	map(data => this.transformToICurrentWeather(data))
    )
    return shape;
  }

  private transformToICurrentWeather(data:ICurrentWeatherData):ICurrentWeather{
  	console.log('transfer', data );
  	return{
  		city:data.name,
  		country:data.sys.country,
  		date: data.dt * 1000,
  		imgage:`http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
  		temperature:this.convertKelvinToFahrenheit(data.main.temp),
  		description:data.weather[0].description
  	}
  }

  private convertKelvinToFahrenheit(kelvin:number):number{
  	return kelvin * 9 / 5 - 459.67
  }
}
