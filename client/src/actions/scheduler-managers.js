import ActionTypes from '../constants/ActionTypes';

const createSchedulerManager = (schedulerManager) => ({
  type: ActionTypes.SCHEDULER_MANAGER_CREATE,
  payload: {
    schedulerManager,
  },
});

createSchedulerManager.success = (localId, schedulerManager) => ({
  type: ActionTypes.SCHEDULER_MANAGER_CREATE__SUCCESS,
  payload: {
    localId,
    schedulerManager,
  },
});

createSchedulerManager.failure = (localId, error) => ({
  type: ActionTypes.SCHEDULER_MANAGER_CREATE__FAILURE,
  payload: {
    localId,
    error,
  },
});

const handleSchedulerManagerCreate = (
  schedulerManager,
  scheduler,
  // board,
  users,
  schedulerManagers,
  schedulerMemberships,
  schedulerLabels,
  schedulerEvents,
  // boards,
  // boardMemberships,
  // labels,
  // lists,
  // cards,
  // cardMemberships,
  // cardLabels,
  // tasks,
  // attachments,
  // deletedNotifications,
) => ({
  type: ActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE,
  payload: {
    schedulerManager,
    scheduler,
    // board,
    users,
    schedulerManagers,
    schedulerMemberships,
    schedulerLabels,
    schedulerEvents,
    // boards,
    // boardMemberships,
    // labels,
    // lists,
    // cards,
    // cardMemberships,
    // cardLabels,
    // tasks,
    // attachments,
    // deletedNotifications,
  },
});

handleSchedulerManagerCreate.fetchScheduler = (id, currentUserId) => ({
  type: ActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE__SCHEDULER_FETCH,
  payload: {
    id,
    currentUserId,
  },
});

const deleteSchedulerManager = (id, isCurrentUser, isCurrentScheduler) => ({
  type: ActionTypes.SCHEDULER_MANAGER_DELETE,
  payload: {
    id,
    isCurrentUser,
    isCurrentScheduler,
  },
});

deleteSchedulerManager.success = (schedulerManager) => ({
  type: ActionTypes.SCHEDULER_MANAGER_DELETE__SUCCESS,
  payload: {
    schedulerManager,
  },
});

deleteSchedulerManager.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_MANAGER_DELETE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerManagerDelete = (schedulerManager, isCurrentUser, isCurrentScheduler) => ({
  type: ActionTypes.SCHEDULER_MANAGER_DELETE_HANDLE,
  payload: {
    schedulerManager,
    isCurrentUser,
    isCurrentScheduler,
  },
});

export default {
  createSchedulerManager,
  handleSchedulerManagerCreate,
  deleteSchedulerManager,
  handleSchedulerManagerDelete,
};
