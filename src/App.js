import { useState } from 'react';
import './App.css';
import CaloriesPage from './components/CaloriesPage';
import NutritionPage from './components/NutritionPage';
import WelcomePage from './components/WelcomePage';
import { useBottleData } from './hooks/useBottleData';

const CALORIES_PER_UNIT = {
  milk: 250,
  protein: 400,
};

function App() {
  const {
    slot,
    daily,
    totalCalories,
    websocketUrl,
    connectionState,
    connectionError,
    lastMessage,
  } = useBottleData();
  const [expandedCard, setExpandedCard] = useState(null);
  const [goalCalories, setGoalCalories] = useState(2200);
  const [plannedMilk, setPlannedMilk] = useState(2);
  const [plannedProtein, setPlannedProtein] = useState(1);
  const [activePage, setActivePage] = useState('welcome');

  const getSummary = (type) => {
    const bottles = slot[type];
    const available = bottles.filter((bottle) => bottle.available === true).length;
    const consumed = bottles.filter((bottle) => bottle.available === false).length;
    const pending = bottles.filter((bottle) => bottle.available === null).length;

    return {
      bottles,
      available,
      consumed,
      pending,
      caloriesPerUnit: CALORIES_PER_UNIT[type],
    };
  };

  const milkSummary = getSummary('milk');
  const proteinSummary = getSummary('protein');

  const plannedCalories =
    plannedMilk * CALORIES_PER_UNIT.milk + plannedProtein * CALORIES_PER_UNIT.protein;
  const projectedTotal = totalCalories + plannedCalories;
  const remainingCalories = Math.max(goalCalories - projectedTotal, 0);

  const renderBottleCard = (title, type, accentClass, summary, currentExpandedCard, onToggleCard) => {
    const isExpanded = currentExpandedCard === type;

    return (
      <article className={`dashboard-card bottle-card ${accentClass}`}>
        <div className="card-heading">
          <div>
            <p className="eyebrow">{type === 'milk' ? 'Recovery Fuel' : 'Performance Boost'}</p>
            <h2>{title}</h2>
          </div>
          <span className="unit-chip">{summary.caloriesPerUnit} kcal / unit</span>
        </div>

        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-label">Available</span>
            <strong>{summary.available}</strong>
          </div>
          <div className="metric-box">
            <span className="metric-label">Consumed</span>
            <strong>{summary.consumed}</strong>
          </div>
        </div>

        {summary.pending > 0 && (
          <p className="sync-note">
            {summary.pending} bottle{summary.pending > 1 ? 's' : ''} waiting for server sync
          </p>
        )}

        <button
          className="expand-button"
          type="button"
          onClick={() => onToggleCard(isExpanded ? null : type)}
        >
          {isExpanded ? 'Hide bottle status' : 'Show bottle status'}
        </button>

        {isExpanded && (
          <div className="bottle-status-list">
            {summary.bottles.map((bottle) => (
              <div key={bottle.id} className="bottle-status-item">
                <div>
                  <strong>{title} #{bottle.id}</strong>
                  <span>{bottle.calories} kcal</span>
                </div>
                <span
                  className={`status-badge ${
                    bottle.available === true
                      ? 'is-available'
                      : bottle.available === false
                        ? 'is-consumed'
                        : 'is-pending'
                  }`}
                >
                  {bottle.available === true
                    ? 'Available'
                    : bottle.available === false
                      ? 'Consumed'
                      : 'Waiting'}
                </span>
              </div>
            ))}
          </div>
        )}
      </article>
    );
  };

  const pages = [
    { id: 'welcome', label: 'Welcoming' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'calories', label: 'Calories' },
  ];

  const renderActivePage = () => {
    if (activePage === 'nutrition') {
      return (
        <NutritionPage
          expandedCard={expandedCard}
          milkSummary={milkSummary}
          proteinSummary={proteinSummary}
          onToggleCard={setExpandedCard}
          renderBottleCard={renderBottleCard}
        />
      );
    }

    if (activePage === 'calories') {
      return (
        <CaloriesPage
          daily={daily}
          goalCalories={goalCalories}
          plannedCalories={plannedCalories}
          plannedMilk={plannedMilk}
          plannedProtein={plannedProtein}
          projectedTotal={projectedTotal}
          remainingCalories={remainingCalories}
          setGoalCalories={setGoalCalories}
          setPlannedMilk={setPlannedMilk}
          setPlannedProtein={setPlannedProtein}
          totalCalories={totalCalories}
        />
      );
    }

    return (
      <WelcomePage
        connectionError={connectionError}
        connectionState={connectionState}
        lastMessage={lastMessage}
        websocketUrl={websocketUrl}
      />
    );
  };

  return (
    <main className="app-shell">
      <section className="dashboard-layout">
        <div className="content-panel">
          <div className="page-tabs" role="tablist" aria-label="Left panel pages">
            {pages.map((page) => (
              <button
                key={page.id}
                className={`page-tab ${activePage === page.id ? 'is-active' : ''}`}
                type="button"
                onClick={() => setActivePage(page.id)}
              >
                {page.label}
              </button>
            ))}
          </div>

          {renderActivePage()}
        </div>

        <aside className="visual-panel" aria-label="Fitness motivation visual">
          <div className="visual-overlay" />
          <div className="hero-copy">
    
          </div>

          <div className="hero-stat hero-stat-top">
            <span>Live calories</span>
            <strong>{totalCalories} kcal</strong>
          </div>
          <div className="hero-stat hero-stat-bottom">
            <span>Available bottles</span>
            <strong>{milkSummary.available + proteinSummary.available}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
