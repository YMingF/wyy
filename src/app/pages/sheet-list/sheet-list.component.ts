import {Component, OnInit} from '@angular/core';
import {SheetParams, SheetService} from '../../service/sheet.service';
import {ActivatedRoute} from '@angular/router';
import {SheetList} from '../../service/data-types/common.types';
import {BatchActionsService} from '../../store/batch-actions.service';

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
  orderValue = 'hot';

  constructor(private sheetService: SheetService, private route: ActivatedRoute, private batchActionServe: BatchActionsService) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit() {

  }

  getList() {
    this.sheetService.getSheets(this.listParams).subscribe(sheets => {
      this.sheets = sheets;
      console.log('获取的数据');
      console.log(this.listParams);
    });
  }

  onOrderChange(order: 'new' | 'hot') {
    this.listParams.order = order;
    this.listParams.offset = 1;
    this.getList();
  }

  onPlaySheet(id:number) {
    this.sheetService.playSheet(id).subscribe(list => {
      this.batchActionServe.selectPlayList({list, index: 0});
    });
  }

  toInfo(id) {
  }

  onPageChange(page: number) {
    this.listParams.offset = page;
    this.getList();
  }
}
