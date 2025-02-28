import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Header, Tab } from 'semantic-ui-react';
import { usePopup } from '../../../lib/popup';

import InformationEdit from './InformationEdit';
import DeleteStep from '../../DeleteStep';
import ServiceTypes from '../../../constants/ServiceTypes';

import styles from './GeneralPane.module.scss';

const GeneralPane = React.memo(({ serviceType, name, onUpdate, onDelete }) => {
  const [t] = useTranslation();

  const DeletePopup = usePopup(DeleteStep);

  let deleteServiceElement;
  switch (serviceType) {
    case ServiceTypes.KANBAN: {
      deleteServiceElement = (
        <DeletePopup
          title="common.deleteProject"
          content="common.areYouSureYouWantToDeleteThisProject"
          buttonContent="action.deleteProject"
          onConfirm={onDelete}
        >
          <Button className={styles.actionButton}>
            {t('action.deleteProject', {
              context: 'title',
            })}
          </Button>
        </DeletePopup>
      );
      break;
    }
    case ServiceTypes.SCHEDULER: {
      deleteServiceElement = (
        <DeletePopup
          title="common.deleteScheduler"
          content="common.areYouSureYouWantToDeleteThisScheduler"
          buttonContent="action.deleteScheduler"
          onConfirm={onDelete}
        >
          <Button className={styles.actionButton}>
            {t('action.deleteScheduler', {
              context: 'title',
            })}
          </Button>
        </DeletePopup>
      );
      break;
    }
    default:
  }

  return (
    <Tab.Pane attached={false} className={styles.wrapper}>
      <InformationEdit
        defaultData={{
          name,
        }}
        onUpdate={onUpdate}
      />
      <Divider horizontal section>
        <Header as="h4">
          {t('common.dangerZone', {
            context: 'title',
          })}
        </Header>
      </Divider>
      <div className={styles.action}>{deleteServiceElement}</div>
    </Tab.Pane>
  );
});

GeneralPane.propTypes = {
  serviceType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default GeneralPane;
