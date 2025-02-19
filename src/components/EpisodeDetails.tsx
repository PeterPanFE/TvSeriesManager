import React, { useEffect, useState } from 'react';
import { Episode } from '../types';

interface EpisodeDetailsProps {
  episode: Episode;
  onClose: () => void;
}

const EpisodeDetails: React.FC<EpisodeDetailsProps> = ({ episode, onClose }) => {
  const [imageUrl, setImageUrl] = useState('');
  const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png';

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://img.omdbapi.com/?apikey=df7223cb&i=${episode.imdbId}`);
        if (!response.ok) throw new Error('Image fetch failed');
        setImageUrl(response.url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setImageUrl(defaultImage);
      }
    };
    fetchImage();
  }, [episode.imdbId]);

  return (
    <div
      className="h-full"
      onClick={onClose}
    >
      <div
        className="relative flex w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageUrl} alt={episode.title} className="w-1/2 h-full object-cover" />
        <div className="w-1/2 p-10">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-2">{episode.title}</h2>
          <p>{episode.series}</p>
          <p className="text-sm">
            Season {episode.seasonNumber}, Episode {episode.episodeNumber}
          </p>
          <p className="text-sm mt-2">{episode.description}</p>
          <p className="text-xs mt-4">Released: {episode.releaseDate}</p>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetails;
