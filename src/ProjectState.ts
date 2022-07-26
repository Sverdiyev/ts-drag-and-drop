import { Listener, Project, ProjectStatus } from './interfaces.js';

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
    this.updateListeners();
  }
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const prj = this.projects.find((prj) => prj.id === projectId);
    if (!prj || newStatus === prj?.status) return;
    prj.status = newStatus;
    this.updateListeners();
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

export const PrjState = ProjectState.getInstance();
