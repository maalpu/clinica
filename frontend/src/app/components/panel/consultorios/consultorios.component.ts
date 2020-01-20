import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-consultorios',
  templateUrl: './consultorios.component.html',
  styleUrls: ['./consultorios.component.css']
})
export class ConsultoriosComponent implements OnInit {

  data;
  value;

  constructor(private restServ: RestService) { }

  ngOnInit() {
    this.getData();
  }

  getInputValue() {
  }

  async getData() {
    try {
      this.data = await this.restServ
      .getConsultorios()
      .toPromise();
      this.data = this.data.consultorios;

    } catch (error) {}
  }


}
