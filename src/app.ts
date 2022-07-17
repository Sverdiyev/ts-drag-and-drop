class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  formEl: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = <HTMLTemplateElement>(
      document.getElementById('project-input')
    );
    this.hostEl = <HTMLDivElement>document.getElementById('app');

    const importedNode = document.importNode(this.templateEl.content, true);
    this.formEl = <HTMLFormElement>importedNode.firstElementChild;
    this.formEl.id = 'user-input';

    this.titleInputEl = <HTMLInputElement>this.formEl.querySelector('#title');
    this.descriptionInputEl = <HTMLInputElement>(
      this.formEl.querySelector('#description')
    );
    this.peopleInputEl = <HTMLInputElement>this.formEl.querySelector('#people');
    this.configure();
    this.attach();
  }

  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherInputs();
    console.log('🚀 ~ submitHandler ~ userInput', userInput);

    this.clearInputs();
  }
  private configure() {
    this.formEl.addEventListener('submit', this.submitHandler.bind(this));
  }

  private gatherInputs(): [string, string, number] {
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = this.descriptionInputEl.value;
    return [title, description, +people];
  }

  private clearInputs() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.peopleInputEl.value = '';
  }

  private attach() {
    this.hostEl.insertAdjacentElement('afterbegin', this.formEl);
  }
}

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  listElement: HTMLElement;

  constructor(private type: 'active' | 'finished') {
    this.templateEl = <HTMLTemplateElement>(
      document.getElementById('project-list')
    );
    this.hostEl = <HTMLDivElement>document.getElementById('app');

    const importedNode = document.importNode(this.templateEl.content, true);
    this.listElement = <HTMLFormElement>importedNode.firstElementChild;
    this.listElement.id = this.type + '-project';

    this.configure();
    this.attach();
  }
  private attach() {
    this.hostEl.insertAdjacentElement('beforeend', this.listElement);
  }

  private configure() {
    const listId = `${this.type}-projects`;
    this.listElement.querySelector('ul')!.id = listId;
    this.listElement.querySelector('h2')!.innerText =
      this.type.toUpperCase() + ' PROJECTS';
  }
}
new ProjectInput();

new ProjectList('active');
