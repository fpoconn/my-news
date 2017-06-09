import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-article',
  template: `
<div *ngIf="article">
    <header>
        <img class="img-responsive" src={{article.urlToImage}}>
        <div (click)="selectStory(article)">
            {{article.title}}
        </div>      
    </header> 
    <div>
        <div style="padding-bottom: 5px; font-weight: 300;">
            {{article.author}} - {{article.publishedAt}}
        </div>
        <div style="padding-bottom: 5px; font-weight: 400;">
            {{article.description}}
        </div>
    </div>
</div>
  `
})
export class ArticleComponent {

  @Input() article: any;
  @Output() selectEvent = new EventEmitter();


  constructor() { }

  selectStory(story){
      this.selectEvent.emit(story);
  }

}