import socket from './socket';

/* Transformers */

export const transformSchedulerMembership = (schedulerMembership) => ({
  ...schedulerMembership,
  createdAt: new Date(schedulerMembership.createdAt),
});

/* Actions */

const createSchedulerMembership = (schedulerId, data, headers) =>
  socket.post(`/schedulers/${schedulerId}/memberships`, data, headers).then((body) => ({
    ...body,
    item: transformSchedulerMembership(body.item),
  }));

const updateSchedulerMembership = (id, data, headers) =>
  socket.patch(`/scheduler-memberships/${id}`, data, headers).then((body) => ({
    ...body,
    item: transformSchedulerMembership(body.item),
  }));

const deleteSchedulerMembership = (id, headers) =>
  socket.delete(`/scheduler-memberships/${id}`, undefined, headers).then((body) => ({
    ...body,
    item: transformSchedulerMembership(body.item),
  }));

/* Event handlers */

const makeHandleSchedulerMembershipCreate = (next) => (body) => {
  next({
    ...body,
    item: transformSchedulerMembership(body.item),
  });
};

const makeHandleSchedulerMembershipUpdate = makeHandleSchedulerMembershipCreate;

const makeHandleSchedulerMembershipDelete = makeHandleSchedulerMembershipCreate;

export default {
  createSchedulerMembership,
  updateSchedulerMembership,
  deleteSchedulerMembership,
  makeHandleSchedulerMembershipCreate,
  makeHandleSchedulerMembershipUpdate,
  makeHandleSchedulerMembershipDelete,
};
