import React from 'react';
import { EventContainerWrapper } from './EventContainerStyles';

export const EventContainer: React.FC = () => {
  return (
    <EventContainerWrapper>
      <p className="text-lg text-gray-300">
        Esperando eventos de TikTok...
      </p>
    </EventContainerWrapper>
  );
};