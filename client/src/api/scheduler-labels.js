import socket from './socket';

/* Actions */

const createSchedulerLabel = (schedulerId, data, headers) => {
  return socket.post(`/schedulers/${schedulerId}/labels`, data, headers);
};

const updateSchedulerLabel = (id, data, headers) =>
  socket.patch(`/scheduler-labels/${id}`, data, headers);

const deleteSchedulerLabel = (id, headers) =>
  socket.delete(`/scheduler-labels/${id}`, undefined, headers);

export default {
  createSchedulerLabel,
  updateSchedulerLabel,
  deleteSchedulerLabel,
};
