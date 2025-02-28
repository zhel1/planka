import { ORM } from 'redux-orm';

import {
  Activity,
  Attachment,
  Board,
  BoardMembership,
  Card,
  Label,
  List,
  Notification,
  Project,
  ProjectManager,
  Scheduler,
  SchedulerManager,
  SchedulerMembership,
  SchedulerLabel,
  SchedulerEvent,
  Task,
  User,
} from './models';

const orm = new ORM({
  stateSelector: (state) => state.orm,
});

orm.register(
  User,
  Scheduler,
  SchedulerManager,
  SchedulerMembership,
  SchedulerLabel,
  SchedulerEvent,
  Project,
  ProjectManager,
  Board,
  BoardMembership,
  Label,
  List,
  Card,
  Task,
  Attachment,
  Activity,
  Notification,
);

export default orm;
