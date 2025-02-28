import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { format } from 'date-fns';
import { usePopup } from '../../lib/popup';

import Paths from '../../constants/Paths';
import NotificationsStep from './NotificationsStep';
import User from '../User';
import UserStep from '../UserStep';

import styles from './Header.module.scss';

const POPUP_PROPS = {
  position: 'bottom right',
};

const Header = React.memo(
  ({
    service,
    user,
    notifications,
    isLogouting,
    canEditService,
    canEditUsers,
    onServiceSettingsClick,
    onUsersClick,
    onNotificationDelete,
    onUserSettingsClick,
    onLogout,
  }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, [time]);

    const handleServiceSettingsClick = useCallback(() => {
      if (canEditService) {
        onServiceSettingsClick();
      }
    }, [canEditService, onServiceSettingsClick]);

    const NotificationsPopup = usePopup(NotificationsStep, POPUP_PROPS);
    const UserPopup = usePopup(UserStep, POPUP_PROPS);

    return (
      <div className={styles.wrapper}>
        {!service && (
          <Link to={Paths.ROOT} className={classNames(styles.logo, styles.title)}>
            Planka
          </Link>
        )}
        <Menu inverted size="large" className={styles.menu}>
          {service && (
            <Menu.Menu position="left">
              <Menu.Item
                as={Link}
                to={Paths.ROOT}
                className={classNames(styles.item, styles.itemHoverable)}
              >
                <Icon fitted name="arrow left" />
              </Menu.Item>
              <Menu.Item className={classNames(styles.item, styles.title)}>
                {service.name}
                {canEditService && (
                  <Button
                    className={classNames(styles.editButton, styles.target)}
                    onClick={handleServiceSettingsClick}
                  >
                    <Icon fitted name="pencil" size="small" />
                  </Button>
                )}
              </Menu.Item>
            </Menu.Menu>
          )}
          <Menu.Menu position="right">
            <Menu.Item className={classNames(styles.item, styles.clock)}>
              {format(time, 'HH:mm')}
            </Menu.Item>
            {canEditUsers && (
              <Menu.Item
                className={classNames(styles.item, styles.itemHoverable)}
                onClick={onUsersClick}
              >
                <Icon fitted name="users" />
              </Menu.Item>
            )}
            <NotificationsPopup items={notifications} onDelete={onNotificationDelete}>
              <Menu.Item className={classNames(styles.item, styles.itemHoverable)}>
                <Icon fitted name="bell" />
                {notifications.length > 0 && (
                  <span className={styles.notification}>{notifications.length}</span>
                )}
              </Menu.Item>
            </NotificationsPopup>
            <UserPopup
              isLogouting={isLogouting}
              onSettingsClick={onUserSettingsClick}
              onLogout={onLogout}
            >
              <Menu.Item className={classNames(styles.item, styles.itemHoverable)}>
                <span className={styles.userName}>{user.name}</span>
                <User name={user.name} avatarUrl={user.avatarUrl} size="small" />
              </Menu.Item>
            </UserPopup>
          </Menu.Menu>
        </Menu>
      </div>
    );
  },
);

Header.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  service: PropTypes.object,
  user: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */
  isLogouting: PropTypes.bool.isRequired,
  canEditService: PropTypes.bool.isRequired,
  canEditUsers: PropTypes.bool.isRequired,
  onServiceSettingsClick: PropTypes.func.isRequired,
  onUsersClick: PropTypes.func.isRequired,
  onNotificationDelete: PropTypes.func.isRequired,
  onUserSettingsClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  service: undefined,
};

export default Header;
