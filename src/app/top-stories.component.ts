import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {Http} from '@angular/http';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ArticleComponent } from './article.component';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-top-stories',
  template: `
    <div *ngIf="!safeUrl && source" class="container-fluid">
        <div class="media">
            <div class="media-left media-middle">
                <img class="media-object" src="//logo.clearbit.com/ + {{source.url}}" width="75px"> 
            </div>
            <div class="media-body media-middle">
                <h4 class="media-heading">{{source.name}}</h4>
            </div>
            <div class="media-right media-middle">
                <a class="fave" (click)="updateFavorites()" style="margin-right: 30px;">
                    <span id="faveToggle" [ngClass]="getFaveClass()"></span>
                </a>
            </div>
            <div class="media-right media-middle">
                <ul class="nav nav-pills nav-pills-style">
                    <li style="float: right;" *ngFor="let order of source.sortBysAvailable" class="nav" [class.active]="selectedOrder == order"><a (click)="selectOrder(order)">{{order}}</a></li>
                </ul> 
            </div>
        </div>
        <!-- stories -->
        <div *ngIf="articles" class="row">
            <div class="col col-sm-12 col-md-7">
                <app-article (selectEvent)="selectStory($event)" class="story largeStory" *ngIf="articles" [article]="articles[0]"></app-article>
            </div>
            <!-- more headlines list -->
            <div *ngIf="articles.length > 4" class="col col-md-5 other-stories-list">
                <h4 style="padding-left: 5px; margin-bottom: 7px; margin-top: 0px;">More Headlines</h4>
                <li *ngFor="let article of articles | slice:4"><a (click)="selectStory(article)">{{article.title}}</a></li>
            </div>
            <div class="clearfix"></div>
            <div class="row">
                <div class="col col-sm-4">
                    <app-article (selectEvent)="selectStory($event)" class="story mediumStory" *ngIf="articles" [article]="articles[1]"></app-article>
                </div>
                <div class="col col-sm-4">
                    <app-article (selectEvent)="selectStory($event)" class="story mediumStory" *ngIf="articles" [article]="articles[2]"></app-article>
                </div>
                <div class="col col-sm-4">
                    <app-article (selectEvent)="selectStory($event)" class="story mediumStory" *ngIf="articles" [article]="articles[3]"></app-article>
                </div>
            </div>
            <!-- more headlines -->
            <div>
                <hr>
                <div *ngIf="articles.length > 4" class="row other-stories-tiles">
                    <h4 style="padding-left: 0px; margin-top: 0px;">More Headlines</h4>
                    <div *ngFor="let article of articles | slice:4" class="col col-sm-12 col-md-12">
                        <div class="row other-tile">
                            <div class="col col-xs-3">
                                <img class="img-responsive" src={{article.urlToImage}}>
                            </div>
                            <div class="col col-xs-9">
                                <div (click)="selectStory(article)" style="padding-bottom: 5px;">
                                    {{article.title}}
                                </div>
                                <div>
                                    <div style="padding-bottom: 5px; font-weight: 300;">
                                        {{article.author}} - {{article.publishedAt}}
                                    </div>
                                    <div>
                                        {{article.description}}
                                    </div>
                                </div>
                            </div>  <!-- 2nd column -->
                        </div> <!-- other-tile -->
                    </div> <!-- articles -->
                </div> <!-- if articles length -->
            </div> <!-- more headlines div -->
        </div> <!-- if articles -->
    </div> <!-- source -->
    <div *ngIf="!source" style="text-align: center; margin-top: 50px;">
      <h2>Select a news source <span style="margin-left: 25px;" class="glyphicon glyphicon-hand-up"></span></h2>
    </div> 
    <div *ngIf="safeUrl" class="external-news">
        <div>
            <span class="closePanel" (click)="closeStory()"></span>
        </div>
        <div>
            <iframe [src]="safeUrl"></iframe>

        </div>
    </div>
  `
})
export class TopStoriesComponent implements OnChanges {

  @Input() source: any;
  @Output() faveEvent = new EventEmitter();

  selectedOrder: string = 'top';
  articles: any;
  safeUrl: SafeResourceUrl;
  selectedArticleTitle: any;

  constructor(private _http: Http, private domSanitizer: DomSanitizer) { }

  ngOnChanges() {
    
    if(this.source === undefined){
      return;
    }
    this.safeUrl = undefined;

    if(!this.source.sortBysAvailable.includes(this.selectedOrder)){
        this.selectedOrder = 'top';
    }
    this._http.get('https://newsapi.org/v1/articles?source=' + this.source.id
        + '&apiKey=247dae28200d460dbc45f38b7ca1a8e1'
        + '&sortBy=' + this.selectedOrder)
        .map(res => res.json()).subscribe(res => { 
          this.articles = res.articles;
        }); 
  }

  selectStory(article){
      this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(article.url);
      this.selectedArticleTitle = article.title;
  }

  closeStory(){
      this.safeUrl = undefined;
      this.selectedArticleTitle = undefined;
  }

  selectOrder(order){
    this.selectedOrder = order;

    this._http.get('https://newsapi.org/v1/articles?source=' + this.source.id 
        + '&apiKey=247dae28200d460dbc45f38b7ca1a8e1'
        + '&sortBy=' + this.selectedOrder)
        .map(res => res.json()).subscribe(res => { 
          this.articles = res.articles;
        }); 
  }

  updateFavorites(){
    var faves = JSON.parse(localStorage.getItem("favoriteSources"));

    if(!faves) 
        faves = [];
    
    var index = faves.findIndex ( item => item.id === this.source.id);
    if(index < 0){
        faves.push(this.source);
    }
    else{
        faves.splice(index, 1);
    }

    localStorage.setItem("favoriteSources", JSON.stringify(faves));
    this.faveEvent.emit("favoriteChanged");
  }

  getFaveClass(){

    var faves = JSON.parse(localStorage.getItem("favoriteSources"));

    var index = faves.findIndex ( item => item.id === this.source.id);

    if(index > -1){
        document.getElementById("faveToggle").className = "glyphicon glyphicon-heart";
    }
    else{
        document.getElementById("faveToggle").className = "glyphicon glyphicon-heart-empty";
    }

  }

}
