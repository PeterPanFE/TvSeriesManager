import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LIST_EPISODES } from '../graphql/queries';
import { DELETE_EPISODE } from '../graphql/mutations';
import { Episode } from '../types';

interface EpisodeListProps {
  searchTerm: string;
  setSelectedEpisode: (value: Episode) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ searchTerm, setSelectedEpisode }) => {
  const { data, loading, error, refetch } = useQuery(LIST_EPISODES);
  const [deleteEpisode] = useMutation(DELETE_EPISODE, {
    onCompleted: () => refetch(),
  });

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.listEpisodes) {
      setEpisodes(data.listEpisodes);
      setFilteredEpisodes(data.listEpisodes);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = episodes.filter((episode) =>
        episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        episode.series.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEpisodes(filtered);
    } else {
      setFilteredEpisodes(episodes);
    }
  }, [searchTerm, episodes]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this episode?')) {
      await deleteEpisode({ variables: { episodeId: id } });
    }
  };

  if (loading) return <div>Loading episodes...</div>;
  if (error) return <div>Error loading episodes</div>;

  return (
    <ul className="space-y-4">
      {filteredEpisodes.map((episode) => (
        <li
          key={episode.id}
          className={`p-4 border border-gray-600 rounded-lg shadow-md cursor-pointer transition-all flex justify-between items-center ${
            selectedId === episode.id ? 'bg-gray-800 border-gray-600' : ' hover:bg-gray-800'
          }`}
          onClick={() => {
            setSelectedEpisode(episode);
            setSelectedId(episode.id);
          }}
        >
          <div>
            <strong>{episode.title}</strong> ({episode.seasonNumber}x{episode.episodeNumber})
            <div className="text-sm text-gray-600">{episode.series}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(episode.id);
            }}
            className="px-3 py-1 bg-red-300 text-black rounded hover:bg-red-400"
          >
            🗑
          </button>
        </li>
      ))}
    </ul>
  );
};

export default EpisodeList;