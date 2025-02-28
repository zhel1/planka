import { transformSchedulerEvent } from './scheduler-events';
import socket from './socket';
import { transformUser } from './users';
import { transformSchedulerManager, transformSchedulerMember } from './scheduler-managers';
import http from './http';

const getSchedulers = (headers) =>
  socket.get('/schedulers', undefined, headers).then((body) => ({
    ...body,
    included: {
      ...body.included,
      users: body.included.users.map(transformUser),
      schedulerManagers: body.included.schedulerManagers.map(transformSchedulerManager),
      schedulerMemberships: body.included.schedulerMemberships.map(transformSchedulerMember),
    },
  }));

const createScheduler = (data, headers) =>
  socket.post('/schedulers', data, headers).then((body) => ({
    ...body,
    included: {
      ...body.included,
      schedulerManagers: body.included.schedulerManagers.map(transformSchedulerManager),
    },
  }));

const getScheduler = (id, headers) =>
  socket.get(`/schedulers/${id}`, undefined, headers).then((body) => ({
    ...body,
    included: {
      ...body.included,
      users: body.included.users.map(transformUser),
      schedulerManagers: body.included.schedulerManagers.map(transformSchedulerManager),
      schedulerMemberships: body.included.schedulerMemberships.map(transformSchedulerMember),
      schedulerEvents: body.included.schedulerEvents.map(transformSchedulerEvent),
    },
  }));

const updateScheduler = (id, data, headers) => socket.patch(`/schedulers/${id}`, data, headers);

const updateSchedulerBackgroundImage = (id, data, headers) =>
  http.post(`/schedulers/${id}/background-image`, data, headers);

const deleteScheduler = (id, headers) => socket.delete(`/schedulers/${id}`, undefined, headers);

export default {
  getSchedulers,
  createScheduler,
  getScheduler,
  updateScheduler,
  updateSchedulerBackgroundImage,
  deleteScheduler,
};
