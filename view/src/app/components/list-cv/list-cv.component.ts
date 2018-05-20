import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-list-cv',
  templateUrl: './list-cv.component.html',
  styleUrls: ['./list-cv.component.css']
})
export class ListCVComponent implements OnInit {
  listCV = [];
  suggestedJob = [];
  indexCV: any;
  spinner: boolean = true;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.indexCV = 0;
    this.authService.getAllCv().subscribe(data => {
      console.log('aaa', data);
      this.listCV = data;
    })
  }


  getJob(idCV) {
    this.suggestedJob = [];
    this.spinner = true;
    this.authService.getMatchedJob(idCV).subscribe(data => {
      if (data) {
        this.spinner = false;
        this.suggestedJob = data.splice(0, 20);
      }

    })
  }

  openMatchModal(idCV) {
    this.indexCV = idCV;
    this.getJob(idCV);
    $("#matchModal").modal();
  }

}
