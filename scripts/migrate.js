const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Run migration inside the Docker container via psql
// This bypasses pg library scram-sha-256 issues on Windows
const CONTAINER = 'ai_spend_audit_db';
const initSql = path.join(__dirname, 'init.sql');

function migrate() {
  try {
    // Check container is running
    execSync(`docker inspect --format="{{.State.Running}}" ${CONTAINER}`, { stdio: 'pipe' });
  } catch {
    console.error(`  Migration failed: Docker container "${CONTAINER}" is not running.`);
    console.error('  Run: docker-compose up -d');
    process.exit(1);
  }

  try {
    // Copy the SQL file into the container and run it
    execSync(`docker cp "${initSql}" ${CONTAINER}:/tmp/migrate.sql`, { stdio: 'inherit' });
    const result = execSync(
      `docker exec ${CONTAINER} psql -U postgres -d ai_spend_audit -f /tmp/migrate.sql`,
      { encoding: 'utf8' }
    );
    console.log(result);
    console.log('  Migration complete ✓');
  } catch (err) {
    console.error('  Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();