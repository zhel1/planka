import Cookies from 'js-cookie';

import Config from '../constants/Config';

export const setSchedulerSideBarOpened = (opened) => {
  Cookies.set(Config.SCHEDULER_SIDE_BAR_OPENED, opened, {
    secure: window.location.protocol === 'https:',
    sameSite: 'strict',
  });
};

export const getSchedulerSideBarOpened = () => {
  return Cookies.get(Config.SCHEDULER_SIDE_BAR_OPENED) === 'true';
};
