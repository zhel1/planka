import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import DroppableTypes from '../../../../../constants/DroppableTypes';
import EventContainer from '../../../../../containers/EventContainer';
import { Popup } from '../../../../../lib/custom-ui';

const MoreStep = React.memo(({ events }) => {
  const [t] = useTranslation();
  return (
    <>
      <Popup.Header>
        {events.length}{' '}
        {t('common.moreEvents', {
          context: 'title',
        })}
      </Popup.Header>
      <Popup.Content>
        {/* droppableId must be uniq (not repeat id in days)  */}
        <Droppable isCombineEnabled droppableId={`day:${100}`} type={DroppableTypes.EVENT}>
          {({ innerRef, droppableProps }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <div {...droppableProps} ref={innerRef}>
              {events.map((event, index) => (
                <EventContainer
                  key={event.id}
                  event={event}
                  index={index}
                  duration={24 * 60 * 60}
                  locationId="more_step"
                  noDuration
                />
              ))}
            </div>
          )}
        </Droppable>
      </Popup.Content>
    </>
  );
});

MoreStep.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  events: PropTypes.array.isRequired,
};

export default MoreStep;
