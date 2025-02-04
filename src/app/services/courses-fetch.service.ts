import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesServiceWithFetch {
  env = environment;
  loadAllCourses = async (): Promise<Course[] | undefined> => {
      const response = await fetch(`${this.env.apiRoot}/courses`);
      console.log("response: ", response)
      const payload = await response.json();
      return payload.courses;
  };
}
