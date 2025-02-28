import socket from './socket';

/* Transformers */

// export const transformSchedulerEvent = (schedulerEvent) => ({
//   ...schedulerEvent,
//   createdAt: new Date(schedulerEvent.createdAt),
//   updatedAt: new Date(schedulerEvent.updatedAt),
// });

export const transformSchedulerEvent = (schedulerEvent) => ({
  ...schedulerEvent,
  ...(schedulerEvent.startDate && {
    startDate: new Date(schedulerEvent.startDate),
  }),
  ...(schedulerEvent.untilDate && {
    untilDate: new Date(schedulerEvent.untilDate),
  }),
});

export const transformSchedulerEventData = (data) => ({
  ...data,
  ...(data.startDate && {
    startDate: data.startDate.toISOString(),
  }),
  ...(data.untilDate && {
    untilDate: data.untilDate.toISOString(),
  }),
});

/* Actions */
const createSchedulerEvent = (schedulerId, data, headers) =>
  socket
    .post(`/schedulers/${schedulerId}/events`, transformSchedulerEventData(data), headers)
    .then((body) => ({
      ...body,
      item: transformSchedulerEvent(body.item),
    }));

const getSchedulerEvent = (id, headers) =>
  socket.get(`/events/${id}`, undefined, headers).then((body) => ({
    ...body,
    item: transformSchedulerEvent(body.item),
  }));

const updateSchedulerEvent = (id, data, headers) =>
  socket.patch(`/events/${id}`, transformSchedulerEventData(data), headers).then((body) => ({
    ...body,
    item: transformSchedulerEvent(body.item),
  }));

const deleteSchedulerEvent = (id, headers) =>
  socket.delete(`/events/${id}`, undefined, headers).then((body) => ({
    ...body,
    item: transformSchedulerEvent(body.item),
  }));

const makeHandleSchedulerEventCreate = (next) => (body) => {
  next({
    ...body,
    item: transformSchedulerEvent(body.item),
  });
};

const makeHandleSchedulerEventUpdate = makeHandleSchedulerEventCreate;

const makeHandleSchedulerEventDelete = makeHandleSchedulerEventCreate;

export default {
  createSchedulerEvent,
  getSchedulerEvent,
  updateSchedulerEvent,
  deleteSchedulerEvent,
  makeHandleSchedulerEventCreate,
  makeHandleSchedulerEventUpdate,
  makeHandleSchedulerEventDelete,
};
