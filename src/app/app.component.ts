import { Component } from '@angular/core';
import { SearchService } from "./service/search.service";
import { SearchResult } from "./service/data-types/common.types";
import { isEmptyObject } from "./utils/tools";

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
        this.searchResult = this.highLightKeyWords(keyWords,res);
      });
    } else {
      this.searchResult = {};
    }
  }
  // 将返回值里和搜索内容一致的数据设置颜色以高亮展示
  highLightKeyWords(keyWords: string,result:SearchResult):SearchResult{
    if (!isEmptyObject(result)){
      const reg=new RegExp(keyWords,'ig');
      ['artists', 'playlists', 'songs'].forEach(type=>{
        if (result[type]){
          result[type].forEach(item=>{
            item.name=item.name.replace(reg,'<span class="highLight">$&<\/span>')
          })
        }
      })
      return result;
    }
  }
}
