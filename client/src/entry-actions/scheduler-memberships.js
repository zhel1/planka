import EntryActionTypes from '../constants/EntryActionTypes';

const createMembershipInCurrentScheduler = (data) => ({
  type: EntryActionTypes.MEMBERSHIP_IN_CURRENT_SCHEDULER_CREATE,
  payload: {
    data,
  },
});

const handleSchedulerMembershipCreate = (schedulerMembership) => ({
  type: EntryActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE,
  payload: {
    schedulerMembership,
  },
});

const updateSchedulerMembership = (id, data) => ({
  type: EntryActionTypes.SCHEDULER_MEMBERSHIP_UPDATE,
  payload: {
    id,
    data,
  },
});

const handleSchedulerMembershipUpdate = (schedulerMembership) => ({
  type: EntryActionTypes.SCHEDULER_MEMBERSHIP_UPDATE_HANDLE,
  payload: {
    schedulerMembership,
  },
});

const deleteSchedulerMembership = (id) => ({
  type: EntryActionTypes.SCHEDULER_MEMBERSHIP_DELETE,
  payload: {
    id,
  },
});

const handleSchedulerMembershipDelete = (schedulerMembership) => ({
  type: EntryActionTypes.SCHEDULER_MEMBERSHIP_DELETE_HANDLE,
  payload: {
    schedulerMembership,
  },
});

export default {
  createMembershipInCurrentScheduler,
  handleSchedulerMembershipCreate,
  updateSchedulerMembership,
  handleSchedulerMembershipUpdate,
  deleteSchedulerMembership,
  handleSchedulerMembershipDelete,
};
