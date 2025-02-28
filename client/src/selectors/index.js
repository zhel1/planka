import router from './router';
import socket from './socket';
import root from './root';
import core from './core';
import modals from './modals';
import users from './users';
import schedulers from './schedulers';
import schedulerManagers from './scheduler-managers';
import schedulerMemberships from './scheduler-memberships';
import schedulerLabels from './scheduler-labels';
import schedulerEvents from './scheduler-events';
import projects from './projects';
import projectManagers from './project-managers';
import boards from './boards';
import boardMemberships from './board-memberships';
import labels from './labels';
import lists from './lists';
import cards from './cards';
import tasks from './tasks';
import attachments from './attachments';

export default {
  ...router,
  ...socket,
  ...root,
  ...core,
  ...modals,
  ...users,
  ...schedulers,
  ...schedulerManagers,
  ...schedulerMemberships,
  ...schedulerLabels,
  ...schedulerEvents,
  ...projects,
  ...projectManagers,
  ...boards,
  ...boardMemberships,
  ...labels,
  ...lists,
  ...cards,
  ...tasks,
  ...attachments,
};
