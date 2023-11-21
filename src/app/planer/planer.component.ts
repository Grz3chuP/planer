import { Component } from '@angular/core';
import {Database_interface} from "../interface/database_interface";

import { CdkDragStart} from "@angular/cdk/drag-drop";



@Component({
  selector: 'app-planer',
  templateUrl: './planer.component.html',
  styleUrls: ['./planer.component.css']

})

export class PlanerComponent {
  dataOd: string = '2023-11-05';
  dataDo: string = '2023-11-10';
  hours: number[] =[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
  topPosition: number = 0;
  leftPosition: number = 0;
  mousePositionX: number = 0;
  mousePositionY: number = 0;
  filtr: Database_interface[] = [];
  dataBase: Database_interface[] = [{
    name: 'Zadanie 1',
    data: '2023-11-01',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 2',
    data: '2023-11-02',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 3',
    data: '2023-11-03',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 4',
    data: '2023-11-04',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 5',
    data: '2023-11-05',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 6',
    data: '2023-11-06',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 7',
    data: '2023-11-07',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 8',
    data: '2023-11-08',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 9',
    data: '2023-11-09',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 10',
    data: '2023-11-10',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 11',
    data: '2023-11-11',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 12',
    data: '2023-11-12',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 13',
    data: '2023-11-13',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 14',
    data: '2023-11-14',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 15',
    data: '2023-11-15',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 16',
    data: '2023-11-16',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 17',
    data: '2023-11-17',
    status: 'Zrobione'
  }, {
    name: 'Zadanie 18',
    data: '2023-11-18',
    status: 'Zrobione'
  }

  ];

  onDateChange() {
    this.filtr = this.dataBase.filter((item) => {
      return item.data >= this.dataOd && item.data <= this.dataDo;

    });

  }


  changeJobPosition(pos:any) {
    console.log(pos);
    this.topPosition = this.topPosition - (this.mousePositionY - pos.dropPoint.y);
    this.leftPosition = this.leftPosition - (this.mousePositionX - pos.dropPoint.x) ;
    console.log(this.topPosition + ' ' + this.leftPosition);

  }

  mousePosition($event: CdkDragStart) {
    if ("clientX" in $event.event) {
      this.mousePositionX = $event.event.clientX;
    }
    if ("clientY" in $event.event) {
      this.mousePositionY = $event.event.clientY;
    }
  }
}
