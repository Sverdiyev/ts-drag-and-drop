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
    console.log(this.titleInputEl.value);
  }
  private configure() {
    this.formEl.addEventListener('submit', this.submitHandler.bind(this));
  }

  private attach() {
    this.hostEl.insertAdjacentElement('afterbegin', this.formEl);
  }
}

new ProjectInput();
