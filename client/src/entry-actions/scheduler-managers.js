import EntryActionTypes from '../constants/EntryActionTypes';

const createManagerInCurrentScheduler = (data) => ({
  type: EntryActionTypes.MANAGER_IN_CURRENT_SCHEDULER_CREATE,
  payload: {
    data,
  },
});

const handleSchedulerManagerCreate = (schedulerManager) => ({
  type: EntryActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE,
  payload: {
    schedulerManager,
  },
});

const deleteSchedulerManager = (id) => ({
  type: EntryActionTypes.SCHEDULER_MANAGER_DELETE,
  payload: {
    id,
  },
});

const handleSchedulerManagerDelete = (schedulerManager) => ({
  type: EntryActionTypes.SCHEDULER_MANAGER_DELETE_HANDLE,
  payload: {
    schedulerManager,
  },
});

export default {
  createManagerInCurrentScheduler,
  handleSchedulerManagerCreate,
  deleteSchedulerManager,
  handleSchedulerManagerDelete,
};
