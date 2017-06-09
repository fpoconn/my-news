import { Component } from '@angular/core';
import {Http} from '@angular/http';

import {TopStoriesComponent} from './top-stories.component';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-default navbar-fixed-top">

      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">POC's Web News</a>

          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
      </div>
      <div class="collapse navbar-collapse" id="navbar-collapse-1">
          <ul class="nav navbar-nav navbar-right">
            <li *ngFor="let keyVal of sourcesKeys" class="dropdown">
              <a *ngIf="sourcesMap.get(keyVal) && sourcesMap.get(keyVal).length > 0" href="#" class="dropdown-toggle" data-toggle="dropdown" 
                    role="button" aria-haspopup="true" aria-expanded="false">{{keyVal}} <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li *ngFor="let newsSource of sourcesMap.get(keyVal)"><a (click)="selectSource(newsSource)">{{newsSource.name}}</a></li>
              </ul>
            </li>
          </ul>
        </div>
       
      </div>
    </nav>
   <app-top-stories [source]="selectedSource" style="padding-top: 75px; position: absolute; width: 100%"></app-top-stories>
  `

})
export class AppComponent {
    title = 'POC\'s Web News!';
    selectedSection: string;
    selectedSource: any;

    sourcesKeys: Array<string> = ['General', 'Technology', 'Sports', 'Business', 'Science', 'Entertainment', 'Politics'];
    sourcesMap: Map<string, any> = new Map();

    constructor(private _http: Http) { }

    ngOnInit(){

       let sources = [];
        
        this._http.get('https://newsapi.org/v1/sources?language=en&country=us')
            .map(res => res.json()).subscribe(res => {
              
                sources = res.sources;

                this.sourcesKeys.forEach( val => {

                    let matchingValues = sources.filter( source => val.toLowerCase() === source.category);

                    if(matchingValues){
                      
                      this.sourcesMap.set(val, matchingValues);
                    }

                });

               
          });

         

    }

    selectSource(newsSrc){
      this.selectedSource = newsSrc;
    }

}
