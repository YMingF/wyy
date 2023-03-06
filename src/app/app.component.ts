import { Component } from '@angular/core';
import { SearchService } from "./service/search.service";
import { SearchResult } from "./service/data-types/common.types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'wyy';
  menu = [{
    label: '发现',
    path: '/home'
  }, {
    label: '歌单',
    path: '/sheet'
  }];
  searchResult: any;
  constructor(private searchServe: SearchService) {
  }

  onSearch(keyWords: string) {
    if (keyWords) {
      this.searchServe.search(keyWords).subscribe(res => {
        this.searchResult = res;
      });
    } else {
      this.searchResult = {};
    }
  }
}
