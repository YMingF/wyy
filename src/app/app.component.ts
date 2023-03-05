import { Component } from '@angular/core';
import { SearchService } from "./service/search.service";

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

  constructor(private searchServe: SearchService) {
  }

  onSearch(keyWords: string) {
    if (keyWords) {
      this.searchServe.search(keyWords).subscribe(res => {
        console.log('结果', res);
      });
    }
  }
}
