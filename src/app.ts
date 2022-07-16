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

new ProjectInput();
