import EntryActionTypes from '../constants/EntryActionTypes';

const createScheduler = (data) => ({
  type: EntryActionTypes.SCHEDULER_CREATE,
  payload: {
    data,
  },
});

const handleSchedulerCreate = (scheduler) => ({
  type: EntryActionTypes.SCHEDULER_CREATE_HANDLE,
  payload: {
    scheduler,
  },
});

const updateCurrentScheduler = (data) => ({
  type: EntryActionTypes.CURRENT_SCHEDULER_UPDATE,
  payload: {
    data,
  },
});

const handleSchedulerUpdate = (scheduler) => ({
  type: EntryActionTypes.SCHEDULER_UPDATE_HANDLE,
  payload: {
    scheduler,
  },
});

const updateCurrentSchedulerBackgroundImage = (data) => ({
  type: EntryActionTypes.CURRENT_SCHEDULER_BACKGROUND_IMAGE_UPDATE,
  payload: {
    data,
  },
});

const deleteCurrentScheduler = () => ({
  type: EntryActionTypes.CURRENT_SCHEDULER_DELETE,
  payload: {},
});

const handleSchedulerDelete = (project) => ({
  type: EntryActionTypes.SCHEDULER_DELETE_HANDLE,
  payload: {
    project,
  },
});

export default {
  createScheduler,
  handleSchedulerCreate,
  updateCurrentScheduler,
  handleSchedulerUpdate,
  updateCurrentSchedulerBackgroundImage,
  deleteCurrentScheduler,
  handleSchedulerDelete,
};
