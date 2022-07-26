import { Draggable, Project } from '../interfaces.js';
import { Component } from './Component.js';

export class ProjectItem
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
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  };

  dragEndHandler = (_: DragEvent) => {};
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
