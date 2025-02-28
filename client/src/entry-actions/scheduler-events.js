import EntryActionTypes from '../constants/EntryActionTypes';

const createSchedulerEvent = (data, autoOpen) => ({
  type: EntryActionTypes.SCHEDULER_EVENT_CREATE,
  payload: {
    data,
    autoOpen,
  },
});

const handleSchedulerEventCreate = (schedulerEvent) => ({
  type: EntryActionTypes.SCHEDULER_EVENT_CREATE_HANDLE,
  payload: {
    schedulerEvent,
  },
});

const updateSchedulerEvent = (id, data) => ({
  type: EntryActionTypes.SCHEDULER_EVENT_UPDATE,
  payload: {
    id,
    data,
  },
});

const updateCurrentSchedulerEvent = (data) => ({
  type: EntryActionTypes.CURRENT_SCHEDULER_EVENT_UPDATE,
  payload: {
    data,
  },
});

const handleSchedulerEventUpdate = (schedulerEvent) => ({
  type: EntryActionTypes.SCHEDULER_EVENT_UPDATE_HANDLE,
  payload: {
    schedulerEvent,
  },
});

const transferSchedulerEvent = (id, schedulerId) => ({
  type: EntryActionTypes.SCHEDULER_EVENT_TRANSFER,
  payload: {
    id,
    schedulerId,
  },
});

const transferCurrentSchedulerEvent = (schedulerId) => ({
  type: EntryActionTypes.CURRENT_SCHEDULER_EVENT_TRANSFER,
  payload: {
    schedulerId,
  },
});

const deleteSchedulerEvent = (id) => ({
  type: EntryActionTypes.SCHEDULER_EVENT_DELETE,
  payload: {
    id,
  },
});

const deleteCurrentSchedulerEvent = () => ({
  type: EntryActionTypes.CURRENT_SCHEDULER_EVENT_DELETE,
  payload: {},
});

const handleSchedulerEventDelete = (schedulerEvent) => ({
  type: EntryActionTypes.SCHEDULER_EVENT_DELETE_HANDLE,
  payload: {
    schedulerEvent,
  },
});

export default {
  createSchedulerEvent,
  handleSchedulerEventCreate,
  updateSchedulerEvent,
  updateCurrentSchedulerEvent,
  handleSchedulerEventUpdate,
  transferSchedulerEvent,
  transferCurrentSchedulerEvent,
  deleteSchedulerEvent,
  deleteCurrentSchedulerEvent,
  handleSchedulerEventDelete,
};
