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
    console.log('response: ', response);
    const payload = await response.json();
    return payload.courses;
  };

  createCourse = async (course: Partial<Course>): Promise<Course> => {
    const reponse = await fetch(`${this.env.apiRoot}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json',
      },
      body: JSON.stringify(course),
    });

    return await reponse.json();
  };

  saveCourse = async (
    courseId: string,
    changes: Partial<Course>
  ): Promise<Course> => {
    const reponse = await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'Application/json',
      },
      body: JSON.stringify(changes),
    });
    return await reponse.json();
  };

  deleteCourse = async (courseId: string): Promise<void> => {
    await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'DELETE',
    });
  };
}
