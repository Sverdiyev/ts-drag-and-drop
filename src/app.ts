abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = <HTMLTemplateElement>document.getElementById(templateId);
    this.hostEl = <T>document.getElementById(hostId);

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = <U>importedNode.firstElementChild;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

type Listener = (items: Project[]) => void;

enum ProjectStatus {
  Active = 'active',
  Finished = 'finished',
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

class ProjectState {
  private projects: Project[] = [];

  private static instance: ProjectState;
  private constructor() {}
  private listeners: Listener[] = [];

  addListener(listenerCb: Listener) {
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
    const newPrj = new Project(
      Math.random().toString(),
      title,
      description,
      nOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newPrj);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const PrjState = ProjectState.getInstance();

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  listElement: HTMLElement;
  assignedProjects: Project[] = [];

  constructor(private type: ProjectStatus) {
    this.templateEl = <HTMLTemplateElement>(
      document.getElementById('project-list')
    );
    this.hostEl = <HTMLDivElement>document.getElementById('app');

    const importedNode = document.importNode(this.templateEl.content, true);
    this.listElement = <HTMLFormElement>importedNode.firstElementChild;

    this.listElement.id = this.type + '-projects';

    PrjState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(
        (project) => project.status == this.type
      );

      this.renderProjects();
    });

    this.attach();
    this.configure();
    this.renderProjects();
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
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
}

const prjInput = new ProjectInput();
const activePrj = new ProjectList(ProjectStatus.Active);
const finishedPrj = new ProjectList(ProjectStatus.Finished);
