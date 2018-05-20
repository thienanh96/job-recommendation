import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private http: Http) {
  }

  getAllCv() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("Access-Control-Allow-Origin", "*");
    return this.http.get('http://localhost:3000/documents/index/cv', { headers: headers })
      .map(res => res.json());
  }

  getAllJob() {
    return this.http.get('http://localhost:3000/documents/index/job')
      .map(res => res.json());
  }

  getMatchedJob(idCV) {
    console.log('idcv', idCV);
    return this.http.get('http://localhost:3000/documents/index/cv/analyze/' + idCV)
      .map(res => res.json());
  }

}
