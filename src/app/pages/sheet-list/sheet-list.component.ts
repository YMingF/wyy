import {Component, OnInit} from '@angular/core';
import {SheetParams, SheetService} from '../../service/sheet.service';
import {ActivatedRoute} from '@angular/router';
import {SheetList} from '../../service/data-types/common.types';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 1,
    limit: 35
  };
  sheets: SheetList;

  constructor(private sheetService: SheetService, private route: ActivatedRoute) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit() {

  }

  getList() {
    this.sheetService.getSheets(this.listParams).subscribe(sheets => {
      this.sheets = sheets;
      console.log('获取的数据');
      console.log(sheets);
    });
  }
}
