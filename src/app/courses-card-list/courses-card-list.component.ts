import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'courses-card-list',
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>();
  //   this input will help us to get input of signal and it's required
  //   we can use aliases or transform input into something else
  //   we don't need require at this time because signal always have initial value
  //   or undefined that angular give it.
  /*
  courses = input.required<Course[]>({
    alias: 'data',
    transform: pureFunction
  });
  */
}
