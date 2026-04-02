function WelcomePage({
  connectionError,
  connectionState,
  lastMessage,
  websocketUrl,
}) {
  return (
    <section className="page-section">
      <div className="intro-block">
        <p className="page-kicker">Fitness Nutrition Dashboard</p>
        <h1 className="welcome-title">Fitness Radar</h1>
        <p className="page-copy">
          Check milk and protein availability fast, review consumed units, and estimate your
          calorie plan without losing focus in the workout flow.
        </p>
        <div className="connection-banner">
          <div className="connection-status">
            <span className={`connection-dot state-${connectionState}`} />
            <span className="connection-pill">Server {connectionState}</span>
          </div>
          <div className="connection-details">
            <strong>Live connection</strong>
            <p>Connected Locally to the shelf</p>
            {lastMessage && <small>Last message: {lastMessage}</small>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WelcomePage;
