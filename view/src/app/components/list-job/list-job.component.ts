import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-list-job',
  templateUrl: './list-job.component.html',
  styleUrls: ['./list-job.component.css']
})
export class ListJobComponent implements OnInit {
  listJOB = [];

  constructor(private authService:AuthService) { }

  ngOnInit() {
  	this.authService.getAllJob().subscribe(data => {
  		this.listJOB = data;
  	})
  }

}
