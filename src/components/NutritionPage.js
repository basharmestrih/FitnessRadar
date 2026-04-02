function NutritionPage({ expandedCard, milkSummary, proteinSummary, onToggleCard, renderBottleCard }) {
  return (
    <section className="page-section">
      <div className="section-copy">
        <p className="page-kicker">Nutrition</p>
        <h2>Track bottle availability and consumed units.</h2>
        <p className="page-copy">
          Keep this page focused on inventory so it is easy to check what is ready right now.
        </p>
      </div>

      <div className="card-stack">
        {renderBottleCard('Protein', 'protein', 'protein-accent', proteinSummary, expandedCard, onToggleCard)}
        {renderBottleCard('Milk', 'milk', 'milk-accent', milkSummary, expandedCard, onToggleCard)}
      </div>
    </section>
  );
}

export default NutritionPage;
