import { DragTarget, Project, ProjectStatus } from '../interfaces.js';
import { PrjState } from '../ProjectState.js';
import { Component } from './Component.js';
import { ProjectItem } from './ProjectItem.js';

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];

  constructor(private type: ProjectStatus) {
    super('project-list', 'app', false, type + '-projects');

    PrjState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(
        (project) => project.status == this.type
      );
      this.renderContent();
    });

    this.configure();
    this.renderContent();
  }

  dragLeaveHandler = (_: DragEvent) => {
    this.element.querySelector('ul')!.classList.remove('droppable');
  };
  dragOverHandler = (event: DragEvent) => {
    event.preventDefault();

    this.element.querySelector('ul')!.classList.add('droppable');
  };
  dropHandler = (event: DragEvent) => {
    this.element.querySelector('ul')!.classList.remove('droppable');
    const prjId = event.dataTransfer?.getData('text/plain');
    if (!prjId) return;
    PrjState.moveProject(prjId, this.type);
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
