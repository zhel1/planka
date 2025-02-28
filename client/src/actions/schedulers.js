import ActionTypes from '../constants/ActionTypes';

const createScheduler = (data) => ({
  type: ActionTypes.SCHEDULER_CREATE,
  payload: {
    data,
  },
});

createScheduler.success = (scheduler, schedulerManagers) => ({
  type: ActionTypes.SCHEDULER_CREATE__SUCCESS,
  payload: {
    scheduler,
    schedulerManagers,
  },
});

createScheduler.failure = (error) => ({
  type: ActionTypes.SCHEDULER_CREATE__FAILURE,
  payload: {
    error,
  },
});

const handleSchedulerCreate = (
  scheduler,
  users,
  schedulerManagers,
  schedulerMemberships,
  schedulerLabels,
  schedulerEvents,
) => ({
  type: ActionTypes.SCHEDULER_CREATE_HANDLE,
  payload: {
    scheduler,
    users,
    schedulerManagers,
    schedulerMemberships,
    schedulerLabels,
    schedulerEvents,
  },
});

const updateScheduler = (id, data) => ({
  type: ActionTypes.SCHEDULER_UPDATE,
  payload: {
    id,
    data,
  },
});

updateScheduler.success = (scheduler) => ({
  type: ActionTypes.SCHEDULER_UPDATE__SUCCESS,
  payload: {
    scheduler,
  },
});

updateScheduler.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_UPDATE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerUpdate = (scheduler) => ({
  type: ActionTypes.SCHEDULER_UPDATE_HANDLE,
  payload: {
    scheduler,
  },
});

const updateSchedulerBackgroundImage = (id) => ({
  type: ActionTypes.SCHEDULER_BACKGROUND_IMAGE_UPDATE,
  payload: {
    id,
  },
});

updateSchedulerBackgroundImage.success = (scheduler) => ({
  type: ActionTypes.SCHEDULER_BACKGROUND_IMAGE_UPDATE__SUCCESS,
  payload: {
    scheduler,
  },
});

updateSchedulerBackgroundImage.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_BACKGROUND_IMAGE_UPDATE__FAILURE,
  payload: {
    id,
    error,
  },
});

const deleteScheduler = (id) => ({
  type: ActionTypes.SCHEDULER_DELETE,
  payload: {
    id,
  },
});

deleteScheduler.success = (scheduler) => ({
  type: ActionTypes.SCHEDULER_DELETE__SUCCESS,
  payload: {
    scheduler,
  },
});

deleteScheduler.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_DELETE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerDelete = (scheduler) => ({
  type: ActionTypes.SCHEDULER_DELETE_HANDLE,
  payload: {
    scheduler,
  },
});

export default {
  createScheduler,
  handleSchedulerCreate,
  updateScheduler,
  handleSchedulerUpdate,
  updateSchedulerBackgroundImage,
  deleteScheduler,
  handleSchedulerDelete,
};
