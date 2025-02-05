import {
  afterNextRender,
  afterRender,
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]);

  constructor(
    private readonly coursesServiceWithFetch: CoursesServiceWithFetch,
    private readonly coursesService: CoursesService
  ) {
    effect(() => {
      console.log('beginners courses: ', this.beginnersCourses());
      console.log('advanced courses: ', this.advancedCourses());
    });

    afterNextRender(() => {
      this.loadCourses().then(() => console.log(this.#courses()));
    });
  }

  beginnersCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  async loadCourses() {
    try {
      const apiCourses = await this.coursesService.loadAllCourses();
      if (apiCourses && apiCourses?.length > 0) {
        this.#courses.set(apiCourses.sort(sortCoursesBySeqNo));
      }
    } catch (error) {
      alert('Error loading courses');
      console.error(error);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourse = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    this.#courses.set(newCourse);
  }
}
