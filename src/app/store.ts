import {signal} from "@angular/core";
import {Job_interface} from "./interface/Job_interface";

export let jobList = signal<Job_interface[]>([]);

export let jobListSignal = signal<Job_interface[]>([]);
