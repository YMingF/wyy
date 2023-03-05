import { Inject, Injectable } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { SearchResult } from "./data-types/common.types";
import { map } from "rxjs/operators";


@Injectable({
  providedIn: ServiceModule
})
export class SearchService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) {
  }

  search(keywords: string): Observable<SearchResult> {
    const params = new HttpParams().set('keywords', keywords);
    return this.http.get(this.url + 'search/suggest', {params}).pipe(map((res: { result: SearchResult }) => {
      return res.result;
    }));
  }

}
