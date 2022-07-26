import { PrjState } from '../ProjectState.js';
import { Component } from './Component.js';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputEl = <HTMLInputElement>this.element.querySelector('#title');
    this.descriptionInputEl = <HTMLInputElement>(
      this.element.querySelector('#description')
    );
    this.peopleInputEl = <HTMLInputElement>(
      this.element.querySelector('#people')
    );
    this.configure();
  }

  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherInputs();

    PrjState.addProject(...userInput);
    this.clearInputs();
  }
  configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this));
  }
  renderContent(): void {}

  private gatherInputs(): [string, string, number] {
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = this.peopleInputEl.value;
    return [title, description, +people];
  }

  private clearInputs() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.peopleInputEl.value = '';
  }
}
