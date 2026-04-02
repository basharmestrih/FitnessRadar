function CaloriesPage({
  daily,
  goalCalories,
  plannedCalories,
  plannedMilk,
  plannedProtein,
  projectedTotal,
  remainingCalories,
  setGoalCalories,
  setPlannedMilk,
  setPlannedProtein,
  totalCalories,
}) {
  return (
    <section className="page-section">
      <div className="section-copy">
        <p className="page-kicker">Calories</p>
        <h2>Plan intake around the rest of the day.</h2>
        <p className="page-copy">
          Adjust a few numbers, then review today&apos;s log in one simple place.
        </p>
      </div>

      <article className="dashboard-card calculator-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">Calorie Planner</p>
            <h2>Shape your intake around the training day</h2>
          </div>
        </div>

        <div className="calculator-grid">
          <label className="input-field">
            <span>Daily goal</span>
            <input
              type="number"
              min="0"
              value={goalCalories}
              onChange={(event) => setGoalCalories(Number(event.target.value) || 0)}
            />
          </label>
          <label className="input-field">
            <span>Planned milk units</span>
            <input
              type="number"
              min="0"
              value={plannedMilk}
              onChange={(event) => setPlannedMilk(Number(event.target.value) || 0)}
            />
          </label>
          <label className="input-field">
            <span>Planned protein units</span>
            <input
              type="number"
              min="0"
              value={plannedProtein}
              onChange={(event) => setPlannedProtein(Number(event.target.value) || 0)}
            />
          </label>
        </div>

        <div className="calculator-summary">
          <div className="summary-pill">
            <span>Consumed now</span>
            <strong>{totalCalories} kcal</strong>
          </div>
          <div className="summary-pill">
            <span>Planned add-on</span>
            <strong>{plannedCalories} kcal</strong>
          </div>
          <div className="summary-pill">
            <span>Projected total</span>
            <strong>{projectedTotal} kcal</strong>
          </div>
          <div className="summary-pill emphasis">
            <span>Remaining to goal</span>
            <strong>{remainingCalories} kcal</strong>
          </div>
        </div>

        <div className="activity-feed">
          <div className="feed-heading">
            <h3>Today&apos;s consumption log</h3>
            <span>{daily.length} events</span>
          </div>

          {daily.length === 0 ? (
            <p className="empty-state">No bottles consumed yet. Your live log will appear here.</p>
          ) : (
            <div className="feed-list">
              {daily.slice().reverse().map((item, index) => (
                <div key={item.key || `${item.time}-${item.name}-${index}`} className="feed-item">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.time}</span>
                  </div>
                  <strong>{item.calories} kcal</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default CaloriesPage;
