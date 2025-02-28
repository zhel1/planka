module.exports = {
  async fn() {
    // Here we need to get all schedulers, where we are managers + schedulers,
    // were we are not managers, but added as members.

    const { currentUser } = this.req;

    const managerSchedulerIds = await sails.helpers.users.getManagerSchedulerIds(currentUser.id); // id of schedulers, where user is manager
    const managerSchedulers = await sails.helpers.schedulers.getMany(managerSchedulerIds); // schedulers, where user is manager

    const membershipSchedulerIds = await sails.helpers.users.getMembershipSchedulerIds(
      currentUser.id,
    ); // id of schedulers, where user is member
    const membershipSchedulers = await sails.helpers.schedulers.getMany(membershipSchedulerIds);

    const schedulerIds = [...managerSchedulerIds, ...membershipSchedulerIds];
    const schedulers = [...managerSchedulers, ...membershipSchedulers];

    const schedulerManagers = await sails.helpers.schedulers.getSchedulerManagers(schedulerIds);
    const schedulerMemberships =
      await sails.helpers.schedulers.getSchedulerMemberships(schedulerIds);

    const schedulerLabels = await sails.helpers.schedulers.getLabels(schedulerIds); // TODO* remove

    const userIds = sails.helpers.utils.mapRecords(schedulerManagers, 'userId', true);
    const users = await sails.helpers.users.getMany(userIds);

    return {
      items: schedulers,
      included: {
        users,
        schedulerManagers,
        schedulerMemberships,
        schedulerLabels, // TODO* remove
      },
    };
  },
};
