import {AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild} from '@angular/core';
import {Database_interface} from "../interface/database_interface";
import {DateTime, Interval} from "luxon";
import {CdkDragStart} from "@angular/cdk/drag-drop";
import {Job_interface} from "../interface/Job_interface";
import {saveData} from "../firebase";


@Component({
  selector: 'app-planer',
  templateUrl: './planer.component.html',
  styleUrls: ['./planer.component.css']

})

export class PlanerComponent implements AfterViewInit {
  // @ViewChild('test') testDiv!: ElementRef;
  jobList: Job_interface[] = [];
  jobListFilter: Job_interface[] = [];
  newJobListPos: Job_interface[] = [];
  dataOd: string = '2023-11-05';
  dataDo: string = '2023-11-10';
  jobHours: number = 0;
  hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  topPosition: number = 20;
  leftPosition: number = 0;
  mousePositionX: number = 0;
  mousePositionY: number = 0;
  elementOffset: { left: number, top: number } = {left: 0, top: 0};
  filtr: Database_interface[] = [];
  daysInRange: any;
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
  jobName: string = '';
  jobDescription: string = '';
  jobDate: any;
  jobTime: any;
  jobPositionX: number = 0;
  jobPositionY: number = 0;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.jobList = [{
      id: 1,
      job_name: 'Zadanie 1',
      job_description: 'Zadanie 1',
      job_date: '2023-11-05',
      job_hours: 8,
      begin_time: 17,
      job_Position_X: 700,
      job_Position_Y: 0
    }, {
      id: 2,
      job_name: 'Zadanie 2',
      job_description: 'Zadanie 2',
      job_date: '2023-11-06',
      job_hours: 12,
      begin_time: 8,
      job_Position_X: 0,
      job_Position_Y: 0
    }];
    this.onDateChange();
  }

  ngAfterViewInit() {

  }

// odczytuje kalendarz i wczytuje wszystkie zadania na te dni
  onDateChange() {
    const od = DateTime.fromISO(this.dataOd);
    const doo = DateTime.fromISO(this.dataDo);
    const dateInterval = Interval.fromDateTimes(od, doo);
    console.log(dateInterval.count('days'));
    this.daysInRange = dateInterval.splitBy({days: 1}).map((item) => item.start);
    console.log(this.daysInRange);
    console.log(this.daysInRange[0].toFormat('yyyy-MM-dd'));
     this.jobListFilter = this.jobList.filter((item) => {
      return item.job_date >= this.dataOd && item.job_date <= this.dataDo;
     });
    this.jobListFilter.forEach((item) => {
      item.job_Position_X = 10 * item.begin_time + ((this.daysDifference(this.dataOd, item.job_date))! * 240);

    });
  }
  // onDateChange() {
  //   this.filtr = this.dataBase.filter((item) => {
  //     return item.data >= this.dataOd && item.data <= this.dataDo;
  //   });
  //   this.jobListFilter = this.jobList.filter((item) => {
  //     return item.job_date >= this.dataOd && item.job_date <= this.dataDo;
  //   });
  //   this.jobListFilter.forEach((item) => {
  //     item.job_Position_X = 10 * item.begin_time + ((this.daysDifference(this.dataOd, item.job_date))! * 240);
  //
  //   });
  // }

  //obliczam roznicę w dniach miedzy datami
  daysDifference(date1: string, date2: string) {
    const date1Obj = DateTime.fromISO(date1);
    const date2Obj = DateTime.fromISO(date2);
    const diff = date1Obj.diff(date2Obj, ['days']).toObject();
    console.log(diff.days);
    return Math.abs(diff.days!);
  }

  //przeliczam i zapisuje kazde zadanie na odpowiednia pozycje
  //dodaje animacje do kazdego zadania
  //glowny event do przesuwania zadania
  changeJobPosition(job: Job_interface, event: any) {

    const element = event.target as HTMLElement;
    this.leftPosition = event.x - this.elementOffset.left;
    // this.topPosition = this.topPosition - (this.mousePositionY - pos.dropPoint.y);
    const thisJob = this.jobList.find((item) => item.id === job.id);
    const newX = this.leftPosition - (this.leftPosition % 10);
    console.log('newX' + newX);
    const newJobListPos: Job_interface[] = [];
    this.jobList.forEach(item => {
      if (item.id !== thisJob!.id) {
        if (item.job_Position_X <= newX + ((thisJob!.job_hours * 10) - 1) && item.job_Position_X + ((item.job_hours * 10) - 1) >= newX) {
          newJobListPos.push(item);
          console.log('newJobListPos' + newJobListPos.length);
        }
      }
    });
    if (newJobListPos.length === 0) {
      thisJob!.job_Position_X = newX;
      element.style.opacity = '1';
      element.style.boxShadow = 'none';
      const claculateDay = Math.floor(newX / 240);
      const date = DateTime.fromISO(this.dataOd).plus({days: claculateDay});
      thisJob!.job_date = date.toFormat('yyyy-MM-dd');
      thisJob!.begin_time = newX % 240 / 10;
    } else {
      //
      element.style.opacity = '1';
      element.style.boxShadow = 'none';
      //
    }

    console.log(this.topPosition + ' ' + this.leftPosition);

  }

  // @HostListener('mousedown', ['$event'])
  // onMouseDown(event: any) {
  // const element = event.target as HTMLElement;
  // element.style.opacity = '0.5';
  //
  // }


  // tu pobiera pozycje myszki
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: any) {
    if ("clientX" in event) {
      this.mousePositionX = event.clientX;
    }
    if ("clientY" in event) {
      this.mousePositionY = event.clientY;
    }
  }

  // tu ustawiam offset dla elementu ktory chce przesunac wzgledem pozycji myszki

  getOffset(el: any) {
    const element = el.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    this.elementOffset = {
      left: this.mousePositionX - rect.left,
      top: this.mousePositionY - rect.top

    };


  }

  createJob() {
    const newJob: Job_interface = {
      id: this.jobList.length + 1,
      job_name: this.jobName,
      job_date: DateTime.now().toFormat('yyyy-MM-dd'),
      job_hours: this.jobHours,
      begin_time: 0,
      job_description: this.jobDescription,
      job_Position_X: this.jobPositionX,
      job_Position_Y: this.jobPositionY
    }
    this.jobList.push(newJob);
    saveData(newJob).then(() => {

        alert('Zapisano');
      }
    );


  }

  animationClear(event: any) {
    const element = event.target as HTMLElement;
    console.log(element);
    element.style.opacity = '1';

  }

  changeStyle($event: DragEvent) {
    const element = $event.target as HTMLElement;
    element.style.opacity = '0.5';
    element.style.boxShadow = '0 0 5px 5px #000000';
  }
}
