import React, { useEffect, useState } from 'react';
import './SportsMatches.css';

const SportsMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiKey = 'a5f65ab7f4e3b84146092fbddb61d52a'; // API-Football kulcs

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('https://v3.football.api-sports.io/fixtures?league=39&season=2023', {
          headers: {
            'x-apisports-key': apiKey
          }
        });
        const data = await response.json();
        // Szűrés 2024 előtti meccsekre
        const filteredMatches = data.response.filter(match => new Date(match.fixture.date).getFullYear() < 2024);
        setMatches(filteredMatches || []);
      } catch (error) {
        console.error('Hiba a meccsek lekérdezésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [apiKey]);

  if (loading) return <div className="text-center text-lg p-4">Betöltés...</div>;

  return (
    <div className="matches-container">
      <h1 className="text-2xl font-bold mb-6 text-center">Labdarúgó Mérkőzések</h1>
      {matches.length === 0 ? (
        <div className="text-center">Nincsenek elérhető meccsek.</div>
      ) : (
        matches.map((match) => (
          <div key={match.fixture.id} className="match-card">
            {/* Hazai csapat */}
            <div className="team">
              <img src={match.teams.home.logo} alt="Home Team Logo" />
              <h2 className="text-lg font-semibold">{match.teams.home.name}</h2>
            </div>

            {/* Időpont */}
            <div className="match-info">
              <p>{new Date(match.fixture.date).toLocaleDateString()}</p>
              <p>{new Date(match.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {/* Vendég csapat */}
            <div className="team">
              <h2 className="text-lg font-semibold">{match.teams.away.name}</h2>
              <img src={match.teams.away.logo} alt="Away Team Logo" />
            </div>

            {/* Fogadási gombok */}
            <div className="bet-buttons">
              <button className="home">Hazai</button>
              <button className="draw">Döntetlen</button>
              <button className="away">Vendég</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SportsMatches;
