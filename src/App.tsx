import React, { useState } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import client from './apolloClient';
import EpisodeList from './components/EpisodeList';
import EpisodeNotifications from './components/EpisodeNotifications';
import SearchBox from './components/SearchBox';
import 'react-datepicker/dist/react-datepicker.css';
import { Episode } from './types';
import EpisodeDetails from './components/EpisodeDetails';
import EpisodeForm from './components/EpisodeForm';
import { LIST_EPISODES } from './graphql/queries';

const App: React.FC = () => {
  const { refetch } = useQuery(LIST_EPISODES);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <ApolloProvider client={client}>
      <div className="w-full h-screen flex flex-col">
        <header className="w-full text-left bg-gray-800 text-white p-6">
          <h1 className="text-2xl font-bold">TV Series Episodes Manager</h1>

        </header>
        <main className="w-full flex-1 p-[50px_100px]">
          <div className="w-full flex justify-between mb-6 border-b-2 border-gray-400 pb-2">
            <h2 className="text-xl font-semibold ">Episodes</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ➕ Add Episode
            </button>
          </div>
          <div className="w-full flex justify-between gap-6">
            <div className="w-2/5">
              <SearchBox searchTerm={searchTerm} onSearch={setSearchTerm} />
              <div className="h-180 overflow-y-auto mt-5">
                <EpisodeList searchTerm={searchTerm} setSelectedEpisode={setSelectedEpisode} />
              </div>            </div>
            <div className="w-3/5">
              {selectedEpisode ? (
                <EpisodeDetails episode={selectedEpisode} onClose={() => setSelectedEpisode(null)} />
              ) : (
                <div className="text-gray-500">Select an episode to view details</div>
              )}
            </div>
          </div>
          <EpisodeNotifications />
          {/* Episode Form Modal */}
          {showForm && <EpisodeForm onClose={() => setShowForm(false)} onEpisodeAdded={refetch} />}

        </main>
      </div>
    </ApolloProvider>
  );
};

export default App;