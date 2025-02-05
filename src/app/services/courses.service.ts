import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private readonly http: HttpClient) {}
  env = environment;

  loadAllCourses = async (): Promise<Course[] | undefined> => {
    const courses$ = this.http.get<GetCoursesResponse>(
      `${this.env.apiRoot}/courses`
    );
    const response = await firstValueFrom(courses$); // this will return promise of the first emited value
    return response.courses;
  };

  createCourse = async (course: Partial<Course>): Promise<Course> => {
    const course$ = this.http.post<Course>(
      `${this.env.apiRoot}/courses`,
      course
    );
    return firstValueFrom(course$);
    // it's best practice to remove await since we don't have try/catch block here.
  };

  saveCourse = async (
    courseId: string,
    course: Partial<Course>
  ): Promise<Course> => {
    const course$ = this.http.put<Course>(
      `${this.env.apiRoot}/courses/${courseId}`,
      course
    );
    return firstValueFrom(course$);
  };

  deleteCourse = async (courseId: string): Promise<void> => {
    const delete$ = this.http.delete<void>(`${this.env.apiRoot}/${courseId}`);
    return firstValueFrom(delete$);
  };
}
