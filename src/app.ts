interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

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

  protected abstract configure(): void;
  protected abstract renderContent(): void;
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

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];

  constructor(private type: ProjectStatus) {
    super('project-list', 'app', false, type + '-projects');
    console.log(this.element);

    PrjState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(
        (project) => project.status == this.type
      );
      this.renderContent();
    });

    this.configure();
    this.renderContent();
  }

  dragLeaveHandler = (event: DragEvent) => {
    console.log('🚀 ~ event', event);
  };
  dragOverHandler = (event: DragEvent) => {
    console.log('🚀 ~ event', event);

    this.element.querySelector('ul')!.classList.add('droppable');
  };
  dropHandler = (event: DragEvent) => {
    console.log('🚀 ~ event', event);
  };

  protected configure() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.innerText =
      this.type.toUpperCase() + ' PROJECTS';

    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
  }

  protected renderContent() {
    const listId = `${this.type}-projects-list`;
    const listEl = document.getElementById(listId)! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(`${this.type}-projects-list`, prjItem);
    }
  }
}

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  get people() {
    if (this.project.people === 1) return '1 person';
    return `${this.project.people} people`;
  }
  constructor(hostId: string, private project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }
  dragStartHandler = (event: DragEvent) => {
    console.log('dragStart');
    console.log(this, event);
  };

  dragEndHandler = (event: DragEvent) => {
    console.log('drag End');
    console.log(this, event);
  };
  protected configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }
  protected renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.people + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

const prjInput = new ProjectInput();
const activePrj = new ProjectList(ProjectStatus.Active);
const finishedPrj = new ProjectList(ProjectStatus.Finished);
