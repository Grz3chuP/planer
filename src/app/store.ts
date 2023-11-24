import {signal} from "@angular/core";
import {Job_interface} from "./interface/Job_interface";
import {Planer_interface} from "./interface/Planer_interface";

export let planersListSignal = signal<Planer_interface[]>([]);

export let jobListSignal = signal<Job_interface[]>([]);
