import ActionTypes from '../constants/ActionTypes';

const createSchedulerMembership = (schedulerMembership) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_CREATE,
  payload: {
    schedulerMembership,
  },
});

createSchedulerMembership.success = (localId, schedulerMembership) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_CREATE__SUCCESS,
  payload: {
    localId,
    schedulerMembership,
  },
});

createSchedulerMembership.failure = (localId, error) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_CREATE__FAILURE,
  payload: {
    localId,
    error,
  },
});

const handleSchedulerMembershipCreate = (
  schedulerMembership,
  scheduler,
  // board,
  users,
  schedulerManagers,
  schedulerMemberships,
  schedulerLabels,
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
  type: ActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE,
  payload: {
    schedulerMembership,
    scheduler,
    // board,
    users,
    schedulerManagers,
    schedulerMemberships,
    schedulerLabels,
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

handleSchedulerMembershipCreate.fetchScheduler = (id, currentUserId, currentSchedulerId) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE__SCHEDULER_FETCH,
  payload: {
    id,
    currentUserId,
    currentSchedulerId,
  },
});

const updateSchedulerMembership = (id, data) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_UPDATE,
  payload: {
    id,
    data,
  },
});

updateSchedulerMembership.success = (schedulerMembership) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_UPDATE__SUCCESS,
  payload: {
    schedulerMembership,
  },
});

updateSchedulerMembership.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_UPDATE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerMembershipUpdate = (schedulerMembership) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_UPDATE_HANDLE,
  payload: {
    schedulerMembership,
  },
});

const deleteSchedulerMembership = (id) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_DELETE,
  payload: {
    id,
  },
});

deleteSchedulerMembership.success = (schedulerMembership) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_DELETE__SUCCESS,
  payload: {
    schedulerMembership,
  },
});

deleteSchedulerMembership.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_DELETE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerMembershipDelete = (schedulerMembership) => ({
  type: ActionTypes.SCHEDULER_MEMBERSHIP_DELETE_HANDLE,
  payload: {
    schedulerMembership,
  },
});

export default {
  createSchedulerMembership,
  handleSchedulerMembershipCreate,
  updateSchedulerMembership,
  handleSchedulerMembershipUpdate,
  deleteSchedulerMembership,
  handleSchedulerMembershipDelete,
};
