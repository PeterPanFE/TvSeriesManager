// src/components/EpisodeNotifications.tsx
import React from 'react';
import { useSubscription } from '@apollo/client';
import { ON_CREATE_EPISODE, ON_UPDATE_EPISODE, ON_DELETE_EPISODE } from '../graphql/subscriptions'; // Assuming you have subscriptions defined

const EpisodeNotifications: React.FC = () => {
  const { data: createData } = useSubscription(ON_CREATE_EPISODE);
  const { data: updateData } = useSubscription(ON_UPDATE_EPISODE);
  const { data: deleteData } = useSubscription(ON_DELETE_EPISODE);

  return (
    <div className="fixed bottom-4 right-4">
      {createData && (
        <div className="bg-green-500 text-white p-2 rounded mb-2">
          New episode created: {createData.onCreateEpisode.title}
        </div>
      )}
      {updateData && (
        <div className="bg-yellow-500 text-white p-2 rounded mb-2">
          Episode updated: {updateData.onUpdateEpisode.title}
        </div>
      )}
      {deleteData && (
        <div className="bg-red-500 text-white p-2 rounded mb-2">
          Episode deleted
        </div>
      )}
    </div>
  );
};

export default EpisodeNotifications;
