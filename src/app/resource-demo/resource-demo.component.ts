import { Component, effect, inject, resource, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment';
import { Lesson } from '../models/lesson.model';

@Component({
  selector: 'resource-demo',
  templateUrl: './resource-demo.component.html',
  styleUrls: ['./resource-demo.component.scss'],
  imports: [MatProgressSpinner],
})
export class ResourceDemoComponent {
  env = environment;

  search = signal<string>('');
  // because we are firing many request to back-end, we can convert this signal to observalbe and
  // then add debounceTime and distinguishedUntiChanged operator and then we convert it back to signal
  // then we would you that signal in the search
  // but this is just to my understanding, because there is the abort controller that are provided by resource
  // for example if we type: signal => we will fire 5 request but 4 request will be canceled and the last one will make it

  // resouse api, that deals with asyncronous signals
  // Constructs a Resource that projects a reactive request to an asynchronous operation defined by a loader function, which exposes the result of the loading operation via signals.
  lessons = resource<Lesson[], { search: string }>({
    request: () => ({
      search: this.search(),
      // then we would you that signal in the search, because when search changes, it's going to trigger the request
    }),
    // here we go with abort signal, which will cancel previous requests and only land the new one
    loader: async ({ request, abortSignal }) => {
      const response = await fetch(
        `${this.env.apiRoot}/search-lessons?query=${request.search}&courseId=18`,
        {
          signal: abortSignal,
        }
      );
      const json = await response.json();
      return json.lessons as Lesson[];
    },
  });

  constructor() {
    effect(() => {
      console.log('searching lessons:', this.search());
      console.log('lessons value:', this.lessons.value());
    });
  }

  searchLessons(search: string) {
    this.search.set(search);
  }

  reset() {}

  reload() {}
}
