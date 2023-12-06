import {AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild} from '@angular/core';
import {DateTime, Interval} from "luxon";
import {Job_interface} from "../interface/Job_interface";
import {readData, removeData, saveChanges, saveData} from "../firebase";
import {jobListSignal, planersListSignal} from "../store";
import {Planer_interface} from "../interface/Planer_interface";
import {never} from "rxjs";


@Component({
  selector: 'app-planer',
  templateUrl: './planer.component.html',
  styleUrls: ['./planer.component.css']

})

export class PlanerComponent implements AfterViewInit {

  currentDragingJob: Job_interface | undefined;
  //wybrane zadania do wyswietlenia w tej dacie
  jobListFilter: Job_interface[] = [];
  newJobListPos: Job_interface[] = [];
  planersList: Planer_interface[] = [];
  //data od i do
  dataOd: string = '2023-11-22';
  dataDo: string = '2023-11-30';
  //ilosc godzin w dniu tylko do wyswietlenia
  hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  topPosition: number = 20;
  leftPosition: number = 0;
  mousePositionX: number = 0;
  mousePositionY: number = 0;
  elementOffset: { left: number, top: number } = {left: 0, top: 0};
  daysInRange: any;

  //dane z formularza
  jobName: string = '';
  jobDescription: string = '';
  jobPositionX: number = 0;
  jobPositionY: number = 0;
  jobHours: number = 0;

  //lista planerow
  jobPlaner: any;
  newJobsList: any;

  //wyliczanie scrolla
  previousScroll = 0;
  scrolledDistance = 0;

  //zoom menu
  zoomValue: number = 1;
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    const planer1: Planer_interface = {
      id: 1,
      planer_name: 'planer1',
    }
    const planer2: Planer_interface = {
      id: 2,
      planer_name: 'planer2',
    }

    planersListSignal().push(planer1);
    planersListSignal().push(planer2);


    // planersListSignal().push(this);
    readData().then((data: Job_interface | void) => {
      if (data) {
        Object.values(data).forEach((item: Job_interface) => {
          jobListSignal().push(item);
          console.log('itemy z bazy danych' + item);
        });

      }
      console.log(data);

      // jobListSignal().push(data);
      this.onDateChange();
    });

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
    this.jobListFilter = jobListSignal().filter((item) => {
      return item.job_date >= this.dataOd && item.job_date <= this.dataDo;

    });
    this.jobListFilter.forEach((item) => {
      item.job_Position_X = (10 * item.begin_time + ((this.daysDifference(this.dataOd, item.job_date))! * 240)) * this.zoomValue;

    });
  }
//przeliczam scrolla
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const curentScroll = window.scrollX || document.documentElement.scrollLeft;

    this.scrolledDistance = curentScroll - this.previousScroll;
    this.previousScroll = curentScroll;
  }



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
    if(!job.job_lock) {
      const element = event.target as HTMLElement;
      this.leftPosition = event.x - this.elementOffset.left + this.previousScroll;
      // this.topPosition = this.topPosition - (this.mousePositionY - pos.dropPoint.y);
      const thisJob = jobListSignal().find((item) => item.id === job.id);
      const newX = this.leftPosition - (this.leftPosition % 10);
      console.log('newX' + newX);
      const newJobListPos: Job_interface[] = [];
      jobListSignal().forEach(item => {
        if (item.id !== thisJob!.id) {
          if (item.job_planer_id === thisJob!.job_planer_id) {
            if (item.job_Position_X <= newX + ((thisJob!.job_hours * 10) - 1) && item.job_Position_X + ((item.job_hours * 10) - 1) >= newX) {
              newJobListPos.push(item);
              console.log('newJobListPos' + newJobListPos.length);
            }
          }
        }
      });
      if (newJobListPos.length === 0) {
        thisJob!.job_Position_X = newX;
        thisJob!.job_Position_Y = 0;
        element.style.opacity = '1';
        element.style.boxShadow = 'none';
        const claculateDay = Math.floor(newX / 240);
        const date = DateTime.fromISO(this.dataOd).plus({days: claculateDay});
        thisJob!.job_date = date.toFormat('yyyy-MM-dd');
        thisJob!.begin_time = newX % 240 / 10;
        saveChanges(thisJob!);
      } else {
        //
        element.style.opacity = '1';
        element.style.boxShadow = 'none';
        //
      }

      console.log(this.topPosition + ' ' + this.leftPosition);
    }
    else {
      element.style.opacity = '1';
      element.style.boxShadow = 'none';
    }
  }

// tu wyswietlam tylko prace dla danego planera
  getJobsForPlaner(planerId: string) {
    return this.jobListFilter.filter(job => job.job_planer_id === planerId);
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
      id: '',
      job_name: this.jobName,
      job_date: DateTime.now().toFormat('yyyy-MM-dd'),
      job_hours: this.jobHours,
      begin_time: 1,
      job_lock: false,
      is_set: false,
      hours_extended: 0,
      job_description: this.jobDescription,
      job_planer_id: this.jobPlaner,
      job_Position_X: this.jobPositionX,
      job_Position_Y: ((planersListSignal().length -  this.checkWhatIndexIsPickedPlaner() ) * 130)
    }
    jobListSignal().push(newJob);
    saveData(newJob).then(() => {
        this.onDateChange();

      }
    );


  }

  onDragStart(job: Job_interface) {
    this.currentDragingJob = jobListSignal().find((item) => item.id === job.id);

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
    this.currentDragingJob!.hours_extended = 0;
    this.currentDragingJob!.is_set = false;
  }

  removeJob(event: any) {
    console.log('drop event ' + event);
    if (this.currentDragingJob) {
      removeData(this.currentDragingJob.id);
      jobListSignal().splice(jobListSignal().indexOf(this.currentDragingJob), 1);
      this.onDateChange();
    }

  }

  checkWhatIndexIsPickedPlaner() {
    const index = planersListSignal().findIndex((item) => item.planer_name === this.jobPlaner);
    console.log('index '  + index);
    return index;
  }
  protected readonly jobListSignal = jobListSignal;


  protected readonly planersListSignal = planersListSignal;

// zmiana planerow
  changePlanersJob(planer: Planer_interface) {
    // if (planer.planer_name === this.currentDragingJob?.job_planer_id) {
    //   return;
    // } else {
    //   this.currentDragingJob!.job_planer_id = planer.planer_name;

    // }
  }

  //poruszanie manualne elementami
  moveRight(side: number, job: Job_interface) {
   // job.job_Position_X = job.job_Position_X + side;
    const newJobListPos: Job_interface[] = [];
    jobListSignal().forEach(item => {
      if (item.id !== job.id) {
        if (item.job_planer_id === job.job_planer_id) {
          //  if (item.job_Position_X <= newX + ((thisJob!.job_hours * 10) - 1) && item.job_Position_X + ((item.job_hours * 10) - 1) >= newX) {
          if (item.job_Position_X < job.job_Position_X + (job.job_hours * 10) && item.job_Position_X + (item.job_hours * 10)  > job.job_Position_X) {
            newJobListPos.push(item);
            if (!job.is_set) {
              if (newJobListPos[0].job_lock) {
                  job.hours_extended += newJobListPos[0].job_hours;
                  console.log('pozycja' + job.job_Position_X);
                  job.is_set = true;
                  // if ( this.checkingIfJobIsInWay(job).length === 1 ) {
                  //   this.pushObjectRight(side, this.checkingIfJobIsInWay(job)[0]);
                  // }
              }
            }
              if (job.job_Position_X === newJobListPos[0].job_Position_X) {
                  console.log('pozycja' + job.job_Position_X);
                  job.hours_extended -= newJobListPos[0].job_hours;
               job.job_Position_X += newJobListPos[0].job_hours * 10;

                  job.is_set = false;
                newJobListPos.splice(0, 1)



              }
            }
          }
        }

    });
  }

  moveLeft(side: number, job: Job_interface) {
    job.job_Position_X = job.job_Position_X + side;
    const newJobListPos: Job_interface[] = [];
    jobListSignal().forEach(item => {
      if (item.id !== this.currentDragingJob!.id) {
        if (item.job_planer_id === this.currentDragingJob!.job_planer_id) {
          //  if (item.job_Position_X <= newX + ((thisJob!.job_hours * 10) - 1) && item.job_Position_X + ((item.job_hours * 10) - 1) >= newX) {
          if (item.job_Position_X < this.currentDragingJob!.job_Position_X + ((this.currentDragingJob!.job_hours + this.currentDragingJob!.hours_extended) * 10) && item.job_Position_X + (item.job_hours * 10)  > this.currentDragingJob!.job_Position_X) {
            newJobListPos.push(item);

            if (!this.currentDragingJob!.is_set) {
              this.currentDragingJob!.hours_extended += newJobListPos[0].job_hours;
              this.currentDragingJob!.job_Position_X -= this.currentDragingJob!.hours_extended * 10;
              this.currentDragingJob!.is_set = true;
              console.log('newJobListPos' + newJobListPos.length);
          }
          if(this.currentDragingJob!.job_Position_X + (( this.currentDragingJob!.job_hours + this.currentDragingJob!.hours_extended) * 10)  === newJobListPos[0].job_Position_X + (newJobListPos[0].job_hours * 10)) {
            this.currentDragingJob!.hours_extended = 0;
            this.currentDragingJob!.is_set = false;
            newJobListPos.splice(0, 1)
          }
          }
        }
      }
    });



  }


  pushObjectLeft(side: number, job: Job_interface) {
    job.job_Position_X = job.job_Position_X + side;
    if (this.checkingIfJobIsInWay(job).length > 0) {
      if (this.checkingIfJobIsInWay(job)[0].job_lock) {
        if (!job.is_set) {
            job.hours_extended += this.checkingIfJobIsInWay(job)[0].job_hours;
           job.job_Position_X -= job.hours_extended * 10;
            job.is_set = true;

          }
          if(job.job_Position_X + (( job.job_hours + job.hours_extended) * 10)  === this.checkingIfJobIsInWay(job)[0].job_Position_X + (this.checkingIfJobIsInWay(job)[0].job_hours * 10)) {
            job.hours_extended = 0;
            job.is_set = false;
            if (this.checkingIfJobIsInWay(job).length > 0) {
              this.pushObjectLeft(side, this.checkingIfJobIsInWay(job)[0]);
            }
          }

        if (this.checkingIfJobIsInWay(job).length === 2 ) {
          this.pushObjectLeft(side, this.checkingIfJobIsInWay(job)[1]);
        }
      }
      else {
        this.pushObjectLeft(side, this.checkingIfJobIsInWay(job)[0]);
      }

    } else {
      return;
    }

  }
  pushObjectRight(side: number, job: Job_interface) {
    //szuakmy czy istniej in way object
    //jeżeli istnieje to wywłujemy  jeszcze raz na nim tym razem
      job.job_Position_X = job.job_Position_X + side;
      if (this.checkingIfJobIsInWay(job).length > 0) {
        if (this.checkingIfJobIsInWay(job)[0].job_lock) {
            if (!job.is_set) {

                    job.hours_extended +=this.checkingIfJobIsInWay(job)[0].job_hours;
                    console.log('pozycja' + job.job_Position_X);
                    job.is_set = true;
                    // if ( this.checkingIfJobIsInWay(job).length === 1 ) {
                    //   this.pushObjectRight(side, this.checkingIfJobIsInWay(job)[0]);
                    // }
            }
            if (job.job_Position_X === this.checkingIfJobIsInWay(job)[0].job_Position_X) {
                console.log('pozycja' + job.job_Position_X);
                job.hours_extended -= this.checkingIfJobIsInWay(job)[0].job_hours;
                job.job_Position_X += this.checkingIfJobIsInWay(job)[0].job_hours * 10;
                job.is_set = false;
              if (this.checkingIfJobIsInWay(job).length > 0) {
                this.pushObjectRight(side, this.checkingIfJobIsInWay(job)[0]);
              }
               // newJobListPos.splice(0, 1)
            }

          if (this.checkingIfJobIsInWay(job).length === 2 ) {
              this.pushObjectRight(side, this.checkingIfJobIsInWay(job)[1]);
          }
        }
        else {
          this.pushObjectRight(side, this.checkingIfJobIsInWay(job)[0]);
        }

      } else {
        return;
      }
    }


  checkingIfJobIsInWay(nextJob: Job_interface) {
    const newJobListPos: Job_interface[] = [];
    jobListSignal().forEach(item => {
      if (item.id !== nextJob.id) {
        if (item.job_planer_id === nextJob.job_planer_id) {
          if (item.job_Position_X < nextJob.job_Position_X + ((nextJob.job_hours + nextJob.hours_extended) * 10) && item.job_Position_X + ((item.job_hours + item.hours_extended) * 10) > nextJob.job_Position_X ) {
            newJobListPos.push(item);

          }
        }
      }
    });
    console.log('ostateczny krach' + newJobListPos);
    // Sortowanie według flagi is_lock, aby obiekt z is_lock = true był pierwszy
    newJobListPos.sort((a, b) => {
      if (a.job_lock && !b.job_lock) {
        return -1; // a powinno być przed b
      } else if (!a.job_lock && b.job_lock) {
        return 1; // b powinno być przed a
      } else {
        return 0; // zachowanie istniejącej kolejności dla obiektów, które mają tę samą flagę is_lock
      }
    });


    return newJobListPos;
  }


}
