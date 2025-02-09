import { Component, effect, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'linked-signal-demo',
  templateUrl: './linked-signal-demo.component.html',
  styleUrl: './linked-signal-demo.component.scss',
})
export class LinkedSignalDemoComponent {
  courses = [
    {
      code: 'BEGINNERS',
      title: 'Angular for Beginners',
      defaultQuantity: 10,
    },
    {
      code: 'SIGNALS',
      title: 'Angular Signals In Depth',
      defaultQuantity: 20,
    },
    {
      code: 'SSR',
      title: 'Angular SSR In Depth',
      defaultQuantity: 30,
    },
  ];

  selectedCourse = signal<string | null>('BEGINNERS');
  // linkedSignal is mix between computed primitive and plain writtable signal
  // the result of linkedSignal is writtable signal, it can be updated
  // it's values is also linked to the values of the source signals
  // if one of the sourceSignal get's updated, then computation function will be updated
  // then the output value is going to be new value of linkedSignal
  // when to use this powerful primitive linkedSignal:
  // in the scenario where the value of one signal needs to be reset depending on the value of another signal
  // that's a typical use case of linked signal
  // in other words, usually when you want to calculate signal that depend on the other signal you can use computed signal
  // if by some reason, you see that your application needs, in certain curcumstances to update the value of computed function
  // then you can updated your computed function to linkedSignal
  quantity = linkedSignal({
    source: () => ({ courseCode: this.selectedCourse }),
    // we can have new values or previous
    computation: (source, previous) => {
      console.log('linked signal source: ', source.courseCode());
      console.log('linked signal previous: ', previous);
      return (
        // finding the course that have that code, and if we don't find it we initialy provide 1 as value
        this.courses.find((c) => c.code === source.courseCode())
          ?.defaultQuantity ?? 1
      );
    },
  });

  constructor() {}

  onQuantityChanged(quantity: string) {
    this.quantity.set(parseInt(quantity));
  }

  onArticleAdded() {
    alert(`${this.quantity()} licenses added for ${this.selectedCourse()}`);
  }

  onCourseSelected(courseCode: string) {
    this.selectedCourse.set(courseCode);
  }
}
