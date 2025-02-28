import socket from './socket';

/* Transformers */

export const transformSchedulerManager = (schedulerManager) => ({
  ...schedulerManager,
  createdAt: new Date(schedulerManager.createdAt),
});

export const transformSchedulerMember = (schedulerMember) => ({
  ...schedulerMember,
  createdAt: new Date(schedulerMember.createdAt),
});

/* Actions */

const createSchedulerManager = (schedulerId, data, headers) =>
  socket.post(`/schedulers/${schedulerId}/managers`, data, headers).then((body) => ({
    ...body,
    item: transformSchedulerManager(body.item),
  }));

const deleteSchedulerManager = (id, headers) =>
  socket.delete(`/scheduler-managers/${id}`, undefined, headers).then((body) => ({
    ...body,
    item: transformSchedulerManager(body.item),
  }));

/* Event handlers */

const makeHandleSchedulerManagerCreate = (next) => (body) => {
  next({
    ...body,
    item: transformSchedulerManager(body.item),
  });
};

const makeHandleSchedulerManagerDelete = makeHandleSchedulerManagerCreate;

export default {
  createSchedulerManager,
  deleteSchedulerManager,
  makeHandleSchedulerManagerCreate,
  makeHandleSchedulerManagerDelete,
};
