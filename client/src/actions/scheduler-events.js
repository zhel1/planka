import ActionTypes from '../constants/ActionTypes';

const createSchedulerEvent = (schedulerEvent) => ({
  type: ActionTypes.SCHEDULER_EVENT_CREATE,
  payload: {
    schedulerEvent,
  },
});

createSchedulerEvent.success = (localId, schedulerEvent) => ({
  type: ActionTypes.SCHEDULER_EVENT_CREATE__SUCCESS,
  payload: {
    localId,
    schedulerEvent,
  },
});

createSchedulerEvent.failure = (localId, error) => ({
  type: ActionTypes.SCHEDULER_EVENT_CREATE__FAILURE,
  payload: {
    localId,
    error,
  },
});

const handleSchedulerEventCreate = (schedulerEvent) => ({
  type: ActionTypes.SCHEDULER_EVENT_CREATE_HANDLE,
  payload: {
    schedulerEvent,
  },
});

const updateSchedulerEvent = (id, data) => ({
  type: ActionTypes.SCHEDULER_EVENT_UPDATE,
  payload: {
    id,
    data,
  },
});

updateSchedulerEvent.success = (schedulerEvent) => ({
  type: ActionTypes.SCHEDULER_EVENT_UPDATE__SUCCESS,
  payload: {
    schedulerEvent,
  },
});

updateSchedulerEvent.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_EVENT_UPDATE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerEventUpdate = (schedulerEvent) => ({
  type: ActionTypes.SCHEDULER_EVENT_UPDATE_HANDLE,
  payload: {
    schedulerEvent,
  },
});

const deleteSchedulerEvent = (id) => ({
  type: ActionTypes.SCHEDULER_EVENT_DELETE,
  payload: {
    id,
  },
});

deleteSchedulerEvent.success = (schedulerEvent) => ({
  type: ActionTypes.SCHEDULER_EVENT_DELETE__SUCCESS,
  payload: {
    schedulerEvent,
  },
});

deleteSchedulerEvent.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_EVENT_DELETE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerEventDelete = (schedulerEvent) => ({
  type: ActionTypes.SCHEDULER_EVENT_DELETE_HANDLE,
  payload: {
    schedulerEvent,
  },
});

export default {
  createSchedulerEvent,
  handleSchedulerEventCreate,
  updateSchedulerEvent,
  handleSchedulerEventUpdate,
  deleteSchedulerEvent,
  handleSchedulerEventDelete,
};
