class ProjectState {
  private projects: any[] = [];

  private static instance: ProjectState;
  private constructor() {}
  private listeners: Function[] = [];

  addListener(listenerCb: Function) {
    this.listeners.push(listenerCb);
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
  addProject(title: string, description: string, nOfPeople: number) {
    const newPrj = {
      id: Math.random().toString(),
      title,
      description,
      people: nOfPeople,
    };

    this.projects.push(newPrj);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const PrjState = ProjectState.getInstance();

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

    PrjState.addProject(...userInput);
    this.clearInputs();
  }
  private configure() {
    this.formEl.addEventListener('submit', this.submitHandler.bind(this));
  }

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

  private attach() {
    this.hostEl.insertAdjacentElement('afterbegin', this.formEl);
  }
}

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  listElement: HTMLElement;
  assignedProjects: any[] = [];

  constructor(private type: 'active' | 'finished') {
    this.templateEl = <HTMLTemplateElement>(
      document.getElementById('project-list')
    );
    this.hostEl = <HTMLDivElement>document.getElementById('app');

    const importedNode = document.importNode(this.templateEl.content, true);
    this.listElement = <HTMLFormElement>importedNode.firstElementChild;
    this.listElement.id = this.type + '-projects-list';

    PrjState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.configure();
    this.renderProjects();
    this.attach();
  }
  private attach() {
    this.hostEl.insertAdjacentElement('beforeend', this.listElement);
  }

  private configure() {
    const listId = `${this.type}-projects-list`;
    this.listElement.querySelector('ul')!.id = listId;
    this.listElement.querySelector('h2')!.innerText =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
}

const prjInput = new ProjectInput();
const activePrj = new ProjectList('active');
const finishedPrj = new ProjectList('finished');
