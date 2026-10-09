"use strict";

const modules = [
  { id: "foundations", title: "DBA foundations & architecture", description: "Instances, processes, memory, storage and the query lifecycle.", icon: "◉", tone: "green", duration: "1 hr 35 min", lessons: 4, status: "Start here", level: "FOUNDATIONS" },
  { id: "provisioning", title: "Provisioning & connectivity", description: "Install, configure, connect to, and extend Microsoft SQL Server.", icon: "▣", tone: "blue", duration: "1 hr 40 min", lessons: 4, status: "Up next", level: "SETUP & ACCESS" },
  { id: "sql-admin", title: "T-SQL for database administrators", description: "T-SQL DDL, data types, constraints and safe schema changes.", icon: "⌘", tone: "blue", duration: "2 hr 35 min", lessons: 5, status: "Up next", level: "T-SQL & SCHEMAS" },
  { id: "transactions", title: "Transactions & concurrency", description: "ACID, isolation, locks, deadlocks and transaction control.", icon: "↔", tone: "teal", duration: "1 hr 45 min", lessons: 4, status: "Up next", level: "CORRECTNESS" },
  { id: "security", title: "Roles, privileges & security", description: "Role design, GRANT, ownership, authentication and auditing.", icon: "◇", tone: "purple", duration: "1 hr 40 min", lessons: 4, status: "Up next", level: "SECURITY" },
  { id: "performance", title: "Indexes & query performance", description: "Actual execution plans, Query Store, index design and workload tuning.", icon: "↗", tone: "orange", duration: "2 hr 25 min", lessons: 5, status: "Up next", level: "PERFORMANCE" },
  { id: "reliability", title: "Backup, restore & recovery", description: "Full, differential and transaction-log backups, point-in-time recovery and drills.", icon: "⟳", tone: "yellow", duration: "2 hr 05 min", lessons: 4, status: "Up next", level: "RECOVERY" },
  { id: "availability", title: "High availability & replication", description: "Always On availability groups, failover, readable secondaries and connection pooling.", icon: "◉", tone: "teal", duration: "1 hr 55 min", lessons: 4, status: "Up next", level: "AVAILABILITY" },
  { id: "operations", title: "Maintenance & daily operations", description: "Index and statistics maintenance, capacity, upgrades and safe operations.", icon: "▥", tone: "blue", duration: "1 hr 55 min", lessons: 4, status: "Up next", level: "OPERATIONS" },
  { id: "observability", title: "Monitoring & incident response", description: "Health signals, system catalogs, triage and production incidents.", icon: "⌁", tone: "purple", duration: "1 hr 45 min", lessons: 4, status: "Up next", level: "OBSERVABILITY" },
  { id: "automation", title: "Migrations, automation & capstone", description: "Repeatable change, runbooks, automation and a production design.", icon: "✳", tone: "green", duration: "2 hr 10 min", lessons: 4, status: "Up next", level: "CAPSTONE" }
];

const lessons = {
  foundations: {
    title: "Think like a DBA",
    subtitle: "A query is only one moment in the life of a database. A DBA designs for all the moments around it.",
    takeaway: "A DBA optimizes for trustworthy data, predictable performance, and recoverability—not just a successful SELECT.",
    sections: [
      { title: "Your job is the whole system", body: "As an analyst, you ask the database a question. As a DBA, you make sure the database can answer the question safely, quickly, and repeatedly—while other people are asking questions, traffic is spiking, and hardware occasionally fails." },
      { title: "Start with the failure mode", body: "Before changing a setting, ask what problem it solves, how you will measure the change, and how you will undo it. A good operational change has a baseline, a small blast radius, and a rollback plan." },
      { title: "The DBA feedback loop", body: "Observe the system, form a hypothesis, make one controlled change, and measure the result. This is the same scientific method you already use in analysis—applied to a living service." }
    ],
    flow: [["Observe", "Measure the symptom"], ["Hypothesize", "Find the likely cause"], ["Change", "Make one safe move"], ["Verify", "Compare before & after"]],
    shortcut: "A five-minute habit: write down the exact symptom, start time, and one metric before you touch anything."
  },
  architecture: {
    title: "Inside a database request",
    subtitle: "Follow a SELECT from the client, through the engine, to the rows that come back.",
    takeaway: "A query plan is the engine's chosen route through your data. The same SQL can take very different routes.",
    sections: [
      { title: "Parse, plan, execute", body: "The engine parses SQL into a valid statement, optimizes a plan using schema and statistics, then executes operators to produce rows. Planning is a best guess based on current information—not a promise that the plan is optimal." },
      { title: "Memory is the fast lane", body: "Frequently used data pages are cached in memory. A cache hit avoids storage I/O; a cache miss asks storage for a page. Random reads are often more expensive than sequential reads, which is one reason a useful index can matter." },
      { title: "The write-ahead log", body: "Before a change is considered durable, its log record is persisted. The data page itself can be written later. On restart, the engine replays committed log records and rolls back incomplete work." }
    ],
    flow: [["SQL client", "Send statement"], ["Parser", "Check & normalize"], ["Planner", "Choose a plan"], ["Buffer cache", "Read / write pages"], ["Storage", "Data + log"]],
    shortcut: "When a query is slow, inspect its plan before rewriting it. EXPLAIN is a map, not a performance fix."
  },
  performance: {
    title: "Performance starts with evidence",
    subtitle: "Use query plans and workload evidence to fix the right thing the first time.",
    takeaway: "An index trades extra storage and write work for faster reads on the access patterns it actually supports.",
    sections: [
      { title: "Find the expensive work", body: "Compare estimated and actual rows, look for repeated scans, and check where execution time accumulates. A sequential scan is not automatically bad: for a small table or a query returning most rows, it can be the cheapest plan." },
      { title: "Indexes are structures with a cost", body: "A B-tree index can speed selective filters and ordered lookups. Every extra index consumes storage and makes inserts, updates, and deletes do more work. Add an index to match a real workload, then verify the plan." },
      { title: "Measure end to end", body: "Check latency percentiles, throughput, waits, and resource saturation. Average latency can hide a painful tail. Change one variable, compare against a baseline, and keep the rollback ready." }
    ],
    flow: [["Slow query?", "Confirm the symptom"], ["Explain plan", "Find costly operator"], ["Check selectivity", "Would an index help?"], ["Test & compare", "Keep or roll back"]],
    shortcut: "Read EXPLAIN from the bottom up: find the rows first, then follow how each operator transforms them."
  },
  reliability: {
    title: "A backup is a hypothesis",
    subtitle: "Until you have restored it successfully, you do not know that you have a recovery plan.",
    takeaway: "RPO is how much data you can afford to lose. RTO is how long you can afford to be down.",
    sections: [
      { title: "Choose recovery targets", body: "Recovery Point Objective (RPO) sets the maximum acceptable data loss. Recovery Time Objective (RTO) sets the maximum acceptable outage. Business owners help set both; backup frequency and architecture must meet them." },
      { title: "Match the backup to the failure", body: "Logical exports help recover selected objects; physical backups can restore a whole instance; transaction-log archiving can recover to a point in time. Replication can improve availability but may also replicate accidental deletes." },
      { title: "Practice the restore", body: "Test restoration on an isolated target, record elapsed time, validate data, and rehearse the handoffs. Keep at least one protected copy outside the failure domain of production." }
    ],
    flow: [["Incident", "Contain the blast radius"], ["Pick target", "RPO + RTO"], ["Restore", "Isolated recovery"], ["Validate", "Data + app checks"], ["Resume", "Communicate & monitor"]],
    shortcut: "Schedule a restore drill and time it. The clock you measure is a better RTO estimate than the one you assume."
  },
  security: {
    title: "Access is a design decision",
    subtitle: "Give people and services the smallest set of permissions that still lets them do their job.",
    takeaway: "Separate identities by purpose: application runtime, migrations, reporting, and human administration should not share one superuser.",
    sections: [
      { title: "Least privilege, made practical", body: "Grant access to roles, not individual users. Separate read-only reporting from application writes and administrative actions. Revisit grants when responsibilities change." },
      { title: "Protect the connection", body: "Use encrypted connections where supported, keep secrets in a managed secret store, and rotate credentials with a tested process. Never put production passwords in notebooks, source control, or query examples." },
      { title: "Know what happened", body: "Audit meaningful access and privilege changes. Minimize sensitive data in logs, control who can read those logs, and define a retention period that fits your policy." }
    ],
    flow: [["Identity", "Who is connecting?"], ["Role", "What job do they do?"], ["Grant", "Only required access"], ["Audit", "Can we explain it?"]],
    shortcut: "Create a read-only role first. Most debugging and analytics access does not need UPDATE, DELETE, or schema ownership."
  },
  operations: {
    title: "Safe changes in production",
    subtitle: "A deployment is not complete until its health has been verified and its rollback is understood.",
    takeaway: "Small, observable changes are easier to debug and safer to reverse than one big surprise.",
    sections: [
      { title: "Watch the right signals", body: "Combine database health with service-level outcomes: latency, errors, connection saturation, replication lag, disk growth, and queue depth. A metric is useful when somebody knows what action to take when it changes." },
      { title: "Migrate in compatible steps", body: "Prefer expand-and-contract: add a compatible structure, deploy code that uses it, backfill in bounded batches, then remove the old structure in a later release. Large blocking changes deserve a maintenance plan." },
      { title: "Incidents need a calm loop", body: "Acknowledge impact, assign an incident lead, gather evidence, and make the smallest safe mitigation. Afterward, document contributing conditions and system improvements—not just individual mistakes." }
    ],
    flow: [["Plan", "Scope + rollback"], ["Deploy", "Small blast radius"], ["Observe", "Health + impact"], ["Decide", "Continue or revert"], ["Learn", "Improve the system"]],
    shortcut: "A good alert says what broke, how bad it is, and the first useful link. If it only says a metric moved, it is a dashboard."
  }
};

const curriculum = {
  foundations: [
    { title: "What a DBA owns", objective: "Describe the operating responsibilities behind a successful SQL query.", content: [
      ["From query author to service owner", "A DBA is accountable for the database service: availability, integrity, performance, security, recoverability, and a sustainable operating cost. Analysts usually optimize one result; administrators reason about the workload, concurrent users, failure modes, change windows, and the humans who depend on the data."],
      ["Turn business language into targets", "Translate vague expectations into measurable service objectives. Availability is a percentage over a defined window; latency should include tail percentiles; Recovery Point Objective (RPO) bounds acceptable data loss; Recovery Time Objective (RTO) bounds outage duration. The business owns the targets—the DBA explains the engineering and cost needed to meet them."],
      ["Operate with a change loop", "Before a production change, capture the symptom, baseline, blast radius, rollback, and success signal. Make one reversible change at a time. Afterward compare the same measurements and record what happened. A change without verification is an experiment with no result."]
    ], example: "-- Example service objectives (illustrative)\n-- Availability: 99.9% monthly\n-- p95 read latency: under 150 ms\n-- RPO: 5 minutes; RTO: 60 minutes", note: "Never promise zero data loss or zero downtime without specifying the failure model, measurement window, and tested design.", exercise: "A team says its database “must always be fast.” Name two measurable service objectives you would clarify before proposing a fix." },
    { title: "Instance, cluster, database, schema", objective: "Build a useful mental map of the objects and processes a DBA operates.", content: [
      ["Separate logical objects from the service", "A database service runs an engine instance (or a cluster of coordinated processes). Inside it are databases; databases contain schemas; schemas organize tables, views, routines, and other objects. Roles, connections, storage, and configuration live at different scopes. Scope matters: a command that changes a database is not necessarily an instance-wide command."],
      ["Client and server responsibilities", "A client authenticates, sends a statement, and consumes results. The server accepts the connection, parses and plans the statement, executes operators, coordinates locks and transactions, reads or writes pages, and returns rows. Connection pools reduce connection churn but do not make an unbounded workload safe."],
      ["Know the deployment shape", "A self-managed VM, container, managed database, and distributed service expose different control surfaces. Managed services may hide operating-system access or automate failover; the DBA still owns configuration choices, access, data lifecycle, workload behavior, and recovery verification."]
    ], example: "-- PostgreSQL scope example\n-- instance/cluster -> database -> schema -> table\nSELECT current_database(), current_user, current_schema();", note: "PostgreSQL uses “cluster” to mean a collection of databases managed by one server instance; other vendors use these words differently.", exercise: "A team needs separate namespaces for billing and analytics in one database. Which PostgreSQL object is designed to organize them?" },
    { title: "The query lifecycle", objective: "Explain how SQL becomes a plan and why estimates affect execution.", content: [
      ["Parse and resolve", "The parser checks SQL grammar and resolves names, types, and privileges. A syntactically valid statement can still fail because an object is absent or the caller lacks access. Planning happens after name and type resolution."],
      ["Plan with estimates", "The optimizer compares candidate access paths using estimated row counts, selectivity, costs, and available statistics. It may choose a sequential scan, index scan, join order, or parallel plan. Estimates can be wrong when data is skewed or statistics are stale, so a plan is a hypothesis to verify."],
      ["Execute and return", "Execution reads pages through memory buffers, applies filters and joins, and emits rows. Writes create transactional changes and log records. Network transfer and client rendering can dominate perceived latency even when the database executor is fast."]
    ], example: "EXPLAIN\nSELECT id, total\nFROM orders\nWHERE customer_id = 42;", note: "EXPLAIN shows a planned route; EXPLAIN ANALYZE actually runs the statement. Use ANALYZE carefully on write statements.", exercise: "If a query returns quickly in a SQL console but a dashboard is slow, name two non-executor costs to investigate." },
    { title: "Pages, memory, transaction log and durability", objective: "Connect durable writes to pages, cache, checkpoints, and the transaction log.", content: [
      ["Data pages and the buffer cache", "Database files are organized in pages. Frequently reused pages may be served from shared memory (a buffer cache), avoiding storage reads. A cache hit is helpful but not proof that a query is efficient; excessive memory use can also cause operating-system pressure."],
      ["Write-ahead logging", "Write-ahead logging (WAL) records changes before corresponding data pages are considered safely written. A commit becomes durable when the required log record is flushed according to the configured durability policy. WAL supports crash recovery and, when archived, point-in-time recovery and replication."],
      ["Checkpoints and crash recovery", "A checkpoint bounds how far crash recovery needs to replay. It does not replace backups. Frequent checkpoints can increase write pressure; infrequent ones can increase recovery work. Tune from observed write volume and checkpoint behavior, not copied magic numbers."]
    ], example: "-- PostgreSQL observation points\nSELECT pg_size_pretty(pg_database_size(current_database()));\nSELECT pg_current_wal_lsn(); -- version/privilege dependent", note: "Durability settings can trade latency for risk. Understand synchronous_commit and storage guarantees before changing them.", exercise: "Why can a database acknowledge a committed transaction before its modified table page is written to the main data file?" }
  ],
  provisioning: [
    { title: "Install and configure a SQL Server instance", objective: "Understand instance setup, database files, service accounts, and installation boundaries.", content: [
      ["Install the engine and its dependencies", "A self-managed installation includes server binaries, client tools, extension packages, service definitions, and a data directory. Managed services abstract much of the host lifecycle but still require sizing, network, parameter, encryption, and maintenance choices."],
      ["Initialize only an empty data directory", "initdb creates a new PostgreSQL cluster's system catalogs and baseline configuration. It is not a repair or upgrade command and must never be pointed at an existing production data directory. The service account should own the files and have tightly restricted filesystem access."],
      ["Plan layout and lifecycle", "Separate data, WAL, logs, backups, and temporary storage according to the platform's supported design. Establish ownership, disk monitoring, patch cadence, startup ordering, and recovery procedures before onboarding application traffic."]
    ], example: "# Example only: provision a NEW empty directory as the database OS user\ninitdb -D /var/lib/postgresql/data\n\n# Inspect version and initialized directory before service startup\npostgres --version\npg_ctl -D /var/lib/postgresql/data status", note: "Never run initdb against an existing data directory. Managed database services have provider-specific provisioning and recovery workflows.", exercise: "A server was rebuilt and its old data directory still exists. Why is initdb not the right way to recover it?" },
    { title: "Service lifecycle and configuration", objective: "Distinguish reloadable settings from settings that need a restart.", content: [
      ["Configuration sources", "PostgreSQL settings can come from configuration files, command-line options, ALTER SYSTEM, database or role defaults, and session SET commands. pg_settings shows the effective value and source. Configuration precedence matters during incident response."],
      ["Reload versus restart", "Many settings can be reloaded with pg_ctl reload or SELECT pg_reload_conf(); others require a server restart, shown by pending_restart. A restart changes availability and may affect failover or maintenance windows. Confirm the target node and effective configuration before acting."],
      ["Service management depends on platform", "systemd units, containers, orchestration platforms, and managed-service consoles own process lifecycle differently. Use the supported control plane, verify health after changes, and never kill database processes to clear a symptom without understanding recovery impact."]
    ], example: "SHOW shared_buffers;\nSELECT name, setting, source, context, pending_restart\nFROM pg_settings\nWHERE name IN ('shared_buffers', 'log_min_duration_statement');\nSELECT pg_reload_conf();", note: "A successful reload request does not mean every setting changed; inspect pg_settings and the server log for rejected values.", exercise: "Which fields help you decide if a changed setting needs a restart and whether the intended source actually won?" },
    { title: "Connect with psql and secure networking", objective: "Connect using the command-line client and reason about listener, authentication, and TLS layers.", content: [
      ["Connection anatomy", "A client connection names a host, port, database, role, and TLS policy. psql is the PostgreSQL interactive client. Its meta-commands such as \\conninfo, \\dt, and \\d are client features, not SQL statements."],
      ["Network and authentication layers", "The server must listen on an appropriate interface and the firewall must allow the intended path. pg_hba.conf then matches connection type, database, role, address, and authentication method. A network timeout differs from an authentication rejection or a missing database privilege."],
      ["Require encrypted, attributable access", "Use TLS with certificate validation where appropriate, restrict source networks, avoid trust authentication outside isolated local development, and use individual or service-specific roles. Keep passwords out of shell history and process listings."]
    ], example: "psql \"host=db.example.net port=5432 dbname=appdb user=reporter sslmode=verify-full\"\n\n-- Inside psql (meta-commands)\n\\\\conninfo\n\\\\dt app.*\n\\\\d+ app.customer", note: "Do not expose PostgreSQL directly to the public internet. Use private networking, firewall policy, and managed access paths.", exercise: "A client gets a timeout before authentication. Which layers do you investigate before changing a password?" },
    { title: "Extensions, locale and compatibility", objective: "Manage extensions and locale-dependent behavior with upgrade awareness.", content: [
      ["Extensions add installed capabilities", "An extension requires compatible files on the server and is enabled in a database with CREATE EXTENSION. Availability depends on the operating system package or managed-provider allowlist. Extension ownership, schema, permissions, and supported version belong in the database inventory."],
      ["Encoding and collation affect data behavior", "Database encoding constrains stored text representation; locale and collation influence sorting and comparisons. Collation provider or version changes can alter ordering and invalidate assumptions in indexes. Follow the vendor's rebuild and upgrade guidance."],
      ["Version and support matrix", "Record engine, extension, client-driver, and operating-system versions. Test extension upgrades and restore behavior on the target major version. In managed services, check which extensions and parameters the provider permits."]
    ], example: "SELECT version();\nSELECT extname, extversion FROM pg_extension ORDER BY extname;\n\nCREATE EXTENSION IF NOT EXISTS pg_stat_statements;\n-- extension files must already be installed and supported", note: "CREATE EXTENSION is database-scoped. Test extension upgrades and collation changes before applying them to production.", exercise: "Why can a collation-version change require index maintenance even though the table values did not change?" }
  ],
  "sql-admin": [
    { title: "PostgreSQL SQL map for DBAs", objective: "Recognize the SQL statement families used in daily administration.", content: [
      ["DDL, DML, DCL and transaction control", "Data Definition Language (DDL) changes structure: CREATE, ALTER, DROP, TRUNCATE. Data Manipulation Language (DML) reads or changes rows: SELECT, INSERT, UPDATE, DELETE, and MERGE in supported versions. Data Control Language (DCL) manages access with GRANT and REVOKE. Transaction control includes BEGIN, COMMIT, and ROLLBACK."],
      ["Read syntax deliberately", "A DBA regularly reads application SQL to understand its locks, plans, and transaction scope. WHERE limits affected rows; RETURNING shows changed rows in PostgreSQL; schema-qualifying object names avoids search_path surprises. Never run a destructive statement until you have checked the target and row count."],
      ["Know dialect boundaries", "This course uses PostgreSQL syntax as its concrete reference. MySQL, SQL Server, Oracle, and cloud warehouses differ in data types, identity columns, catalog views, backup tools, locking, and DDL transaction behavior. Verify the target engine and version before applying a command."]
    ], example: "-- Read before you change\nSELECT id, status FROM app.orders WHERE id = 1042;\n\n-- PostgreSQL: inspect changed rows\nUPDATE app.orders SET status = 'closed'\nWHERE id = 1042\nRETURNING id, status;", note: "A semicolon ends a statement; it does not make a multi-statement production change safe. Use a reviewed migration and explicit transaction strategy.", exercise: "Classify CREATE TABLE, GRANT, UPDATE, and COMMIT by statement family." },
    { title: "Databases, schemas and search_path", objective: "Create and qualify namespaces and understand how PostgreSQL resolves object names.", content: [
      ["Create a database and schema", "CREATE DATABASE is a cluster-level operation and cannot run inside an ordinary transaction block in PostgreSQL. A schema is a namespace inside one database. Use schemas to organize ownership and access; avoid treating them as a security boundary unless privileges are configured."],
      ["Qualify important names", "An unqualified table name is resolved through search_path. A writable schema earlier in that path can create name-shadowing risks. For administrative scripts and security-sensitive code, use schema-qualified names such as app.orders and keep the path intentional."],
      ["Manage ownership intentionally", "Objects have owners. Ownership carries powerful alteration and drop capabilities that ordinary grants do not. Create objects under a stable owner role rather than an employee account, and separate object ownership from the application login."]
    ], example: "CREATE DATABASE appdb;\n\\connect appdb  -- psql client command, not SQL\nCREATE SCHEMA app AUTHORIZATION app_owner;\nSET search_path TO app, pg_catalog;\nSELECT * FROM app.orders;", note: "The backslash commands (\\connect, \\dt, \\d) belong to psql, not portable SQL sent by an application.", exercise: "Why is `SELECT * FROM orders` less predictable in a privileged script than `SELECT * FROM app.orders`?" },
    { title: "CREATE TABLE, types and defaults", objective: "Choose data types and define a table with stable keys and useful defaults.", content: [
      ["Choose types from meaning", "Use integer or bigint for identifiers and counts, numeric(p,s) for exact decimal quantities, and timestamptz for real instants in time. text handles variable-length strings; boolean represents true/false. Avoid storing dates as text or currency as floating point."],
      ["Define keys and constraints", "A primary key is unique and not null. Foreign keys preserve relationships. UNIQUE enforces alternate keys; CHECK encodes row-level rules; NOT NULL prevents missing required values. Constraints protect data even when multiple applications write to the table."],
      ["Defaults are not validation", "DEFAULT fills a value when a column is omitted; it does not reject an explicitly supplied invalid value. Use constraints for invariants. Identity columns can generate surrogate keys, but generated identifiers do not replace business-key uniqueness."]
    ], example: "CREATE TABLE app.customer (\n  customer_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email text NOT NULL UNIQUE,\n  created_at timestamptz NOT NULL DEFAULT now(),\n  status text NOT NULL CHECK (status IN ('active', 'paused'))\n);", note: "Use timestamptz for instants; store the display timezone as a separate preference if the application needs it.", exercise: "Add a constraint to `app.invoice` so `amount` cannot be negative, and explain why numeric is preferable to real." },
    { title: "ALTER, INSERT, UPDATE, DELETE safely", objective: "Plan schema and row changes with preview, transaction, and rollback controls.", content: [
      ["Evolve schemas carefully", "ALTER TABLE adds, changes, or removes columns and constraints. Some changes are metadata-only; others rewrite data, scan the table, or take strong locks. Check the specific PostgreSQL version and operation behavior, table size, lock timeout, and deployment compatibility before a large change."],
      ["Preview and bound row changes", "For UPDATE or DELETE, first run a SELECT with the identical predicate, inspect the count, and verify the key. Add a transaction when appropriate, use RETURNING to inspect affected rows, and define a rollback plan. A missing WHERE clause can affect every row."],
      ["Use staged constraints for large tables", "For large production tables, split incompatible changes into deployable steps: add a nullable or compatible shape, deploy code that understands both forms, backfill in small batches, validate, and remove old structure only after consumers have moved."]
    ], example: "BEGIN;\nSELECT count(*) FROM app.customer WHERE status = 'legacy';\nUPDATE app.customer SET status = 'active'\nWHERE status = 'legacy'\nRETURNING customer_id;\n-- inspect returned rows before COMMIT\nROLLBACK; -- use COMMIT only after validation", note: "A transaction does not eliminate lock impact. Keep it short; never hold an interactive transaction open while investigating.", exercise: "Write the three checks you would perform before deleting duplicate rows from a large production table." },
    { title: "Views, materialized views and sequences", objective: "Choose between reusable queries, stored results, and generated key objects.", content: [
      ["Views package a query", "CREATE VIEW stores a query definition, not a separate copy of its rows. It can simplify access and present a stable interface, but the underlying query still runs when the view is read. Views can also help expose a restricted column set."],
      ["Materialized views store results", "CREATE MATERIALIZED VIEW persists query output for faster reads. Its contents become stale until refreshed. Refresh planning must account for runtime, concurrent readers, refresh locking options, and whether consumers accept a freshness delay."],
      ["Sequences and identity", "Sequences generate values independently of transactional rollback, so gaps are normal. Do not interpret a sequence as a gapless business counter. Prefer identity columns for standard generated keys; inspect sequence ownership and privileges when diagnosing insert failures."]
    ], example: "CREATE VIEW app.active_customer AS\nSELECT customer_id, email\nFROM app.customer WHERE status = 'active';\n\nCREATE MATERIALIZED VIEW app.monthly_sales AS\nSELECT date_trunc('month', created_at) AS month, sum(amount) AS total\nFROM app.invoice GROUP BY 1;\nREFRESH MATERIALIZED VIEW app.monthly_sales;", note: "A materialized view is a cache with a refresh contract. Document how stale it may be and who refreshes it.", exercise: "A report can be 15 minutes stale but must respond quickly. Which view type might fit, and what operational job must accompany it?" },
    { title: "INSERT, upsert, DELETE, TRUNCATE and COPY", objective: "Use PostgreSQL row-loading syntax safely and distinguish row changes from table-level operations.", content: [
      ["Insert and upsert", "INSERT adds rows. INSERT ... ON CONFLICT can update or ignore a row when a unique constraint conflicts, making it useful for idempotent ingestion. The conflict target must match a unique or exclusion constraint; RETURNING reveals rows inserted or updated."],
      ["DELETE versus TRUNCATE", "DELETE removes rows selected by a predicate and can return deleted values. TRUNCATE removes all rows quickly, takes a strong lock, and has different trigger, identity-reset, and foreign-key behavior. CASCADE can remove dependent table contents too; inspect dependencies before using it."],
      ["Bulk loading with COPY", "COPY is designed for efficient bulk transfer. Validate file encoding, delimiter, null representation, column order, constraints, and transaction size. Load into a staging table when possible, validate counts and quality, then merge into production in controlled steps."]
    ], example: "INSERT INTO app.customer (email, status)\nVALUES ('dba@example.test', 'active')\nON CONFLICT (email) DO UPDATE\nSET status = EXCLUDED.status\nRETURNING customer_id, email;\n\nDELETE FROM app.job WHERE expires_at < now()\nRETURNING job_id;\n-- COPY app.stage_customer (email, status)\n-- FROM STDIN WITH (FORMAT csv, HEADER true);", note: "Never use TRUNCATE or ON CONFLICT DO NOTHING as a way to hide unexpected data problems. Record counts and alert on rejected or skipped rows.", exercise: "A daily import may resend the same customer. What constraint and INSERT form can make the load repeatable without creating duplicates?" },
    { title: "Partitioning for large-table lifecycle", objective: "Understand partition pruning, partition keys, and the operational cost of partitioned tables.", content: [
      ["Partitioning divides one logical table", "Declarative partitioning routes rows into child tables using RANGE, LIST, or HASH bounds. Queries can benefit from partition pruning when predicates constrain the partition key. Partitioning is primarily a data lifecycle and manageability tool; it does not automatically make every query faster."],
      ["Keys and constraints have consequences", "A partitioned table needs a partition key and a strategy for creating, attaching, detaching, and retiring partitions. PostgreSQL uniqueness constraints on a partitioned table generally need to include the partition key, because uniqueness must be enforceable across child tables."],
      ["Operate the partition lifecycle", "Create future partitions before data arrives, alert on missing partitions, manage retention by detaching or dropping old partitions under a reviewed policy, and understand locks and index maintenance. Too many tiny partitions can increase planning and catalog overhead."]
    ], example: "CREATE TABLE app.event (\n  event_id bigint GENERATED ALWAYS AS IDENTITY,\n  occurred_at timestamptz NOT NULL,\n  payload jsonb NOT NULL,\n  PRIMARY KEY (event_id, occurred_at)\n) PARTITION BY RANGE (occurred_at);\n\nCREATE TABLE app.event_2026_10\n  PARTITION OF app.event\n  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');", note: "Partitioning introduces operational work: partition creation, retention, monitoring, and version-specific DDL behavior must be automated and tested.", exercise: "Why does PostgreSQL require a partitioned unique key to include the partition key in many cases, and what happens if next month's partition is not created?" }
  ],
  transactions: [
    { title: "ACID and transaction boundaries", objective: "Explain atomicity, consistency, isolation and durability in practical terms.", content: [
      ["Atomicity and consistency", "Atomicity means a transaction's changes commit together or are rolled back together. Consistency means constraints and application invariants remain true across committed transitions; the database cannot infer every business rule unless it is represented in constraints or application logic."],
      ["Isolation and durability", "Isolation controls how concurrent work observes changes. Durability means committed work survives the failures covered by the engine and storage configuration. These guarantees depend on the database and settings—do not assume every system has identical defaults."],
      ["Set a deliberate boundary", "A transaction should contain one logical unit of work. Long transactions retain locks and old row versions, delay cleanup, and can interfere with replicas. Do network calls and user interactions outside the transaction whenever possible."]
    ], example: "BEGIN;\nUPDATE app.account SET balance = balance - 25 WHERE id = 10;\nUPDATE app.account SET balance = balance + 25 WHERE id = 20;\nCOMMIT;", note: "If a later statement fails, decide explicitly whether the client rolls back; do not leave the session in an open or aborted transaction.", exercise: "Why should a payment workflow not hold a database transaction open while waiting for a user to approve a dialog?" },
    { title: "Isolation levels and anomalies", objective: "Recognize common isolation anomalies and select an isolation strategy.", content: [
      ["Read committed", "In PostgreSQL, READ COMMITTED gives each statement a snapshot of committed data as of that statement's start. A second SELECT in the same transaction can see a later commit. This is convenient but can surprise code that assumes a transaction-wide fixed snapshot."],
      ["Repeatable read and serializable", "REPEATABLE READ uses a stable transaction snapshot but can require retrying after concurrent updates. SERIALIZABLE detects executions that cannot be explained by a serial order and aborts one transaction. The application must retry serialization failures safely."],
      ["Anomalies are workload-shaped", "Lost updates, non-repeatable reads, write skew, and phantoms describe different concurrency outcomes. Isolation level names alone do not prove an invariant safe; choose a database constraint, locking strategy, or serializable transaction that enforces the actual rule."]
    ], example: "BEGIN ISOLATION LEVEL SERIALIZABLE;\nSELECT available FROM app.inventory WHERE sku = 'A17';\nUPDATE app.inventory SET available = available - 1\nWHERE sku = 'A17' AND available > 0;\nCOMMIT; -- application must retry serialization failures", note: "Prefer an atomic conditional UPDATE and check its affected-row count for inventory decrement patterns.", exercise: "Two sessions each see one free seat and both attempt a booking. Name one database mechanism that can prevent overselling." },
    { title: "Locks, blocking and deadlocks", objective: "Interpret lock waits and reduce the risk of blocking incidents.", content: [
      ["Locks protect correctness", "Writes acquire locks on rows and often take table-level locks too. DDL can request locks that conflict with application traffic. A blocked query may be waiting for another transaction, not using too much CPU. Identify the blocker before terminating sessions."],
      ["Deadlocks are cycles", "A deadlock occurs when sessions hold locks each other needs. PostgreSQL detects cycles and aborts one transaction. Reduce risk by acquiring resources in a consistent order, keeping transactions short, and retrying known deadlock errors where the operation is safe to repeat."],
      ["Lock timeout is a guardrail", "A statement_timeout bounds query runtime; lock_timeout bounds time spent waiting for a lock. Set targeted timeouts for risky migrations and sessions. A timeout prevents indefinite waiting but does not replace a rollout or rollback plan."]
    ], example: "SET lock_timeout = '3s';\nSET statement_timeout = '30s';\n\n-- Inspect sessions waiting on locks\nSELECT pid, wait_event_type, wait_event, state, query\nFROM pg_stat_activity\nWHERE wait_event_type = 'Lock';", note: "Do not terminate a backend until you understand its role, transaction, and impact. Cancellation may itself trigger expensive rollback.", exercise: "A migration is waiting behind an old transaction. What do you inspect before canceling either session?" },
    { title: "Savepoints, retries and idempotency", objective: "Design safe recovery and retry behavior around transaction failures.", content: [
      ["Savepoints recover part of a transaction", "SAVEPOINT marks a position inside a transaction. ROLLBACK TO SAVEPOINT undoes later work while keeping earlier work active. Savepoints are useful for controlled partial recovery, not a substitute for simpler transaction boundaries."],
      ["Retries need known failure classes", "Serialization failures and deadlocks are often retryable after rolling back the complete transaction. Validation errors, permission errors, and an uncertain network outcome are different. Retry only when the operation is safe and the whole unit of work can be repeated."],
      ["Idempotency handles uncertainty", "A client can lose its connection after the server commits but before the client receives confirmation. An idempotency key stored under a unique constraint lets a repeated request find the original result rather than duplicate a payment or job."]
    ], example: "BEGIN;\nSAVEPOINT optional_step;\n-- attempt optional work\nROLLBACK TO SAVEPOINT optional_step;\n-- continue with valid required work\nCOMMIT;", note: "If a commit response is lost, the outcome may be unknown. Design a way to query the operation by a stable request identifier.", exercise: "Why is blindly retrying a payment after a timeout dangerous, and what schema-level protection helps?" }
  ],
  security: [
    { title: "Roles, users and ownership", objective: "Separate login identities, functional roles, and object ownership.", content: [
      ["Roles are identities and groups", "PostgreSQL roles can log in and can inherit permissions from other roles. Use named functional roles such as app_reader and app_writer, then grant them to individual or service identities. Avoid shared human logins because they erase attribution."],
      ["Ownership is not an ordinary grant", "The owner controls alteration and removal of an object. GRANT SELECT does not make the recipient the owner. Keep ownership in a non-login role and run migrations with a controlled identity that can assume that role."],
      ["Default privileges affect future objects", "GRANT on existing tables does not automatically cover future tables. ALTER DEFAULT PRIVILEGES applies to objects created by a particular role, in a schema, from that point onward. Test both existing and newly created objects."]
    ], example: "CREATE ROLE app_owner NOLOGIN;\nCREATE ROLE app_reader NOLOGIN;\nCREATE ROLE reporting_user LOGIN INHERIT;\nGRANT app_reader TO reporting_user;\nALTER SCHEMA app OWNER TO app_owner;", note: "Role membership options changed across PostgreSQL versions. Review membership inheritance and SET ROLE behavior on your supported version.", exercise: "Why should the owner of application tables usually not be the application's runtime login?" },
    { title: "GRANT, REVOKE and schema access", objective: "Grant the minimum privileges needed for current and future objects.", content: [
      ["Privileges have multiple scopes", "A user needs CONNECT to a database, USAGE on a schema to resolve objects, and object privileges such as SELECT or INSERT on tables. Sequences may require separate privileges for generated values. Missing schema USAGE can look like a missing table."],
      ["Grant task-shaped access", "Grant read access only where needed; separate DML from DDL. REVOKE removes a grant, but PUBLIC grants and inherited role memberships may still permit access. Audit the effective privilege path, not just one GRANT statement."],
      ["Cover future tables", "For PostgreSQL, set default privileges as the role that will create the objects. A migration run under a different owner may produce different results. Include a test that creates a fresh table and verifies intended access."]
    ], example: "GRANT CONNECT ON DATABASE appdb TO app_reader;\nGRANT USAGE ON SCHEMA app TO app_reader;\nGRANT SELECT ON ALL TABLES IN SCHEMA app TO app_reader;\nALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app\n  GRANT SELECT ON TABLES TO app_reader;", note: "Never assume REVOKE from one role removes access inherited through another role or PUBLIC.", exercise: "A reporting role can connect but gets permission denied for app.customer. Which schema and table privileges do you inspect?" },
    { title: "Authentication, secrets and encryption", objective: "Protect database identities and connections across the service lifecycle.", content: [
      ["Authentication proves identity", "PostgreSQL host-based authentication rules (pg_hba.conf) select an authentication method based on connection type, database, role, and address. Prefer strong password authentication or centrally managed identity mechanisms; avoid trust authentication on untrusted networks."],
      ["Transport and stored secrets", "Use TLS to protect credentials and data in transit, validate certificates when required, and restrict network paths. Store credentials in a secret manager, rotate them deliberately, and ensure logs, crash reports, and connection strings do not leak them."],
      ["Encryption is a lifecycle problem", "Encryption at rest protects media or backups under particular threat assumptions; it does not replace access control on a running server. Document key ownership, rotation, backup encryption, restore access, and what happens if a key is unavailable."]
    ], example: "# Example client settings (not a password)\npsql \"host=db.example.net dbname=appdb user=reporter sslmode=verify-full\"\n\n# PostgreSQL authentication policy lives in pg_hba.conf\n# Prefer scram-sha-256 over legacy password methods", note: "Never paste a production connection string or secret into a shared query console, screenshot, or source repository.", exercise: "What must be verified during a restore if production backups are encrypted with managed keys?" },
    { title: "Auditing, row security and safe access", objective: "Design visibility and data access controls that can be tested.", content: [
      ["Audit what matters", "Capture events that answer security and operational questions: role changes, privileged access, schema changes, and sensitive data access where policy requires it. Minimize captured payloads, restrict log readers, and define retention and alert ownership."],
      ["Row-level security", "PostgreSQL row-level security policies restrict which rows a role can read or modify. RLS is defense in depth: table owners and roles with BYPASSRLS can bypass policies unless FORCE ROW LEVEL SECURITY is used. Validate application session context cannot be spoofed."],
      ["Prove the boundary", "Test access as the actual application role, not as a superuser. Verify allowed and denied operations, inherited grants, new object defaults, and backup/restore behavior. Review access on role changes and service retirement."]
    ], example: "ALTER TABLE app.invoice ENABLE ROW LEVEL SECURITY;\nCREATE POLICY tenant_isolation ON app.invoice\n  USING (tenant_id = current_setting('app.tenant_id')::bigint);\n-- test as the real non-owner application role", note: "A session variable alone is not a secure identity boundary if an untrusted user can set it arbitrarily.", exercise: "Why can a test run as the table owner give false confidence that an RLS policy is working?" }
  ],
  performance: [
    { title: "Read EXPLAIN plans", objective: "Read PostgreSQL plan structure and compare estimates with actual execution.", content: [
      ["Plan tree and costs", "A plan is a tree of scan, join, sort, aggregate, and other nodes. Startup and total cost are planner units, not milliseconds. Rows and width are estimates. Read from leaf scans upward to see how each operation feeds its parent."],
      ["EXPLAIN ANALYZE adds reality", "EXPLAIN ANALYZE executes the query and reports actual rows and time. Compare actual rows with estimates, loop counts, buffers, and timing. For UPDATE or DELETE this changes data; use a safe transaction or a representative staging environment."],
      ["Find the expensive mismatch", "A major estimate error can cascade into a bad join order or memory decision. Look for repeated nested-loop work, large sorts, unexpected sequential reads, and rows removed by filters. A sequential scan is often correct when most rows are needed."]
    ], example: "EXPLAIN (ANALYZE, BUFFERS, VERBOSE)\nSELECT customer_id, sum(total)\nFROM app.orders\nWHERE created_at >= now() - interval '30 days'\nGROUP BY customer_id;", note: "Do not casually run EXPLAIN ANALYZE on a production write statement; it performs the write.", exercise: "What does it suggest when actual rows are 500,000 but the plan estimated 10?" },
    { title: "B-tree indexes and composite order", objective: "Design common B-tree indexes from real predicates and ordering.", content: [
      ["B-tree is the general-purpose default", "B-tree indexes support equality and range comparisons and can provide ordered output. They are useful for selective WHERE clauses, joins, and ORDER BY patterns, but the planner compares their cost with scanning the table."],
      ["Column order follows access patterns", "For a multicolumn B-tree, leading columns matter. An index on (tenant_id, created_at) is well suited to tenant equality followed by a time range. It is not equivalent to a separate index beginning with created_at. Selectivity, sort direction, and actual workload guide design."],
      ["Indexes cost write work", "Each index consumes disk, memory, and maintenance on inserts, updates, and deletes. Redundant or unused indexes slow writes. Verify usage over a representative period and consider write volume before adding another structure."]
    ], example: "CREATE INDEX CONCURRENTLY orders_tenant_created_idx\n  ON app.orders (tenant_id, created_at DESC);\n\n-- inspect index usage (cumulative statistics)\nSELECT relname, indexrelname, idx_scan\nFROM pg_stat_user_indexes;", note: "CREATE INDEX CONCURRENTLY cannot run inside a transaction block and may leave an invalid index after failure; verify catalog state.", exercise: "A query filters by tenant_id, filters a date range, then sorts newest first. Propose an index column order and explain it." },
    { title: "Specialized indexes and expression patterns", objective: "Recognize when partial, expression, GIN, or BRIN indexes fit.", content: [
      ["Partial indexes", "A partial index stores only rows matching a predicate, such as unprocessed jobs. It can be smaller and cheaper to maintain, but the query predicate must imply the index predicate for the planner to use it."],
      ["Expression indexes", "An expression index stores a computed key such as lower(email). The query must use a compatible expression. Generated columns or normalized data may be clearer when the expression is central to the schema."],
      ["GIN and BRIN", "GIN is useful for composite values such as arrays, JSONB containment, or full-text search. BRIN summarizes physical page ranges and can be compact for very large tables whose values correlate with physical order. Neither is a universal replacement for B-tree."]
    ], example: "CREATE INDEX CONCURRENTLY job_ready_idx\n  ON app.job (created_at)\n  WHERE status = 'ready';\n\nCREATE INDEX customer_email_lower_idx\n  ON app.customer (lower(email));\n\nCREATE INDEX event_payload_gin_idx\n  ON app.event USING gin (payload);", note: "Match the operator class and query operators. An index that exists but cannot support the predicate is only overhead.", exercise: "A huge append-only event table is physically ordered by event_time. What index family might provide compact range filtering?" },
    { title: "Statistics, joins and memory pressure", objective: "Connect planner statistics, join choices, and resource limits to query behavior.", content: [
      ["Statistics guide estimates", "ANALYZE samples table data to update planner statistics. Skewed or correlated columns can defeat independent estimates; extended statistics can model selected dependencies. After bulk loads or major distribution changes, ensure statistics are refreshed."],
      ["Join methods are choices", "Nested loop is effective for small outer inputs with indexed lookups; hash join can efficiently match larger unsorted inputs when memory permits; merge join can exploit ordered inputs. The right method depends on cardinality and cost, not a universal rule."],
      ["Memory is per operation and often per session", "work_mem can be used by multiple sorts or hash operations in one query and by many concurrent sessions. Raising it globally can multiply memory demand. Look at sort spills, hash batches, concurrency, and server headroom before changing it."]
    ], example: "ANALYZE app.orders;\n\nCREATE STATISTICS orders_tenant_status_stats\n  (dependencies, mcv)\n  ON tenant_id, status FROM app.orders;\nANALYZE app.orders;", note: "Do not tune work_mem based on one query in isolation; include peak connection and parallel-worker concurrency.", exercise: "A hash join spills to disk during peak traffic. What evidence would you collect before increasing work_mem?" },
    { title: "A repeatable query tuning workflow", objective: "Tune from workload evidence and verify the result without hiding regressions.", content: [
      ["Start with the workload", "Identify the query fingerprint, call rate, latency distribution, rows returned, and time window. A 200 ms query called ten thousand times may matter more than one 20-second report run once a month."],
      ["Change one cause at a time", "Capture a plan and baseline, then test one change: predicate shape, index, statistics, or configuration. Check both the target query and write-side impact. Prefer representative data and concurrency in staging."],
      ["Keep, roll back, or continue", "Compare p50 and tail latency, CPU, I/O, buffers, lock waits, and error rate. Record the result and remove experiments that did not help. Query plan changes after data growth are a signal to monitor, not an excuse to force a plan blindly."]
    ], example: "-- PostgreSQL workload statistics (pg_stat_statements extension)\nSELECT queryid, calls, mean_exec_time, rows, query\nFROM pg_stat_statements\nORDER BY total_exec_time DESC\nLIMIT 20;", note: "Plan forcing can mask stale statistics or data-shape changes. Prefer understanding why the optimizer chose a plan first.", exercise: "Design a before/after measurement for an index change that captures read benefit and write cost." }
  ],
  reliability: [
    { title: "Recovery objectives and failure domains", objective: "Translate business recovery goals into testable technical requirements.", content: [
      ["RPO and RTO are different", "RPO is the maximum acceptable data loss measured backward from an incident. RTO is the maximum acceptable time to restore service. A system can have a short RPO and a long RTO, or the reverse; one backup schedule does not define both."],
      ["Classify failure scenarios", "Consider operator error, application bugs, disk or host loss, regional outage, credential compromise, and ransomware. Replication may address a host failure but copy logical mistakes. An online backup may not help if an attacker can delete it with production credentials."],
      ["Build independent protection", "Keep backup copies in a separate failure domain with limited deletion rights, encryption, and monitored retention. Document ownership and escalation. Recovery design includes people, access, network, keys, compute capacity, and validation—not only files."]
    ], example: "-- Recovery plan checklist\n-- RPO: ______  RTO: ______\n-- Backup owner: ______\n-- Isolated restore target: ______\n-- Last successful restore drill: ______", note: "A replica is not a backup: it can faithfully replicate corruption, accidental deletion, or malicious changes.", exercise: "A database has synchronous standby replication but no backups. Which failure classes remain poorly covered?" },
    { title: "Logical and physical backups", objective: "Select backup methods and understand their restore granularity.", content: [
      ["Logical backups", "pg_dump exports database objects and data in a portable logical form. It supports selective object recovery and upgrades between compatible major versions, but large restores can take longer and require recreating cluster-level roles separately."],
      ["Physical base backups", "Physical backups capture database files for a compatible major version and platform. They are suited to whole-cluster recovery and combine with archived WAL for point-in-time recovery. Manage consistency, retention, compression, and restore throughput."],
      ["Choose by recovery need", "Logical and physical methods solve different problems. Use logical backups for object-level extraction and portability; use physical plus WAL for faster full recovery and PITR. Many production systems use both, with independent protection."]
    ], example: "# PostgreSQL examples; run from an authorized host\npg_dump -Fc -d appdb -f appdb.dump\npg_restore --list appdb.dump\n\n# Physical base backup (tool/options depend on version)\npg_basebackup -D /backup/base -Fp -Xs -P", note: "These commands are examples, not a complete backup policy. Test permissions, encryption, destination isolation, retention, and restore time.", exercise: "You need to restore one accidentally dropped table and also recover a whole cluster to yesterday 14:00. Which backup capabilities do you need?" },
    { title: "WAL archiving and point-in-time recovery", objective: "Explain the WAL archive chain and the steps needed for a point-in-time restore.", content: [
      ["WAL is the change stream", "PostgreSQL writes sequential WAL segments describing changes. Archiving completed segments to protected storage enables replay from a base backup. A gap, corruption, or retention expiry can break the recovery chain."],
      ["PITR chooses a target", "Point-in-time recovery restores a base backup and replays WAL until a chosen timestamp, transaction ID, or named recovery target. Stop before the unwanted change. Validate application invariants and ensure the recovered data is isolated before redirecting clients."],
      ["Monitor archive health", "Track archive success, oldest recoverable point, WAL generation rate, storage capacity, and restore duration. A backup job reporting success does not prove that the chain reaches the time you need."]
    ], example: "# PostgreSQL configuration concepts (version-specific)\narchive_mode = on\narchive_command = '...copy WAL segment to protected archive...'\nrestore_command = '...retrieve requested WAL segment...'\n# Set recovery target in recovery.signal configuration", note: "Do not copy a literal placeholder archive_command into production. Use a reliable tool with atomic upload, retries, and alerting.", exercise: "What does a missing WAL segment do to a point-in-time restore that needs to replay beyond that segment?" },
    { title: "Restore drills and incident recovery", objective: "Run a restore validation rather than treating backup completion as success.", content: [
      ["Prepare the recovery environment", "Document how to provision compute, retrieve credentials and encryption keys, restore files, replay logs, and isolate the recovered instance. Ensure the procedure works when production identity systems are unavailable."],
      ["Validate more than startup", "Check database consistency, expected schemas, row counts or business invariants, application connectivity, permissions, and recovery timestamp. Record restore duration and compare it with RTO. Never send users to a recovered database before deciding the correct cutover."],
      ["Learn from the drill", "A drill should reveal missing access, unclear steps, slow storage, stale documentation, and hidden dependencies. Fix the runbook and repeat. Measure successful recoveries, not just backup-job green checks."]
    ], example: "-- Restore validation questions\n-- Did recovery stop before the bad transaction?\n-- Are critical tables and row counts plausible?\n-- Can the app's least-privilege role connect?\n-- How long did each recovery step take?", note: "Restore into an isolated environment first. Validate source, target, recovery point, and authorization before any cutover.", exercise: "List four things to verify besides “the database process started” during a restore drill." }
  ],
  availability: [
    { title: "Availability patterns and tradeoffs", objective: "Distinguish backups, replicas, failover and high availability.", content: [
      ["Availability is a system property", "A highly available database needs failure detection, a viable promotion path, client reconnection, data consistency rules, and operational ownership. A standby that is never tested may not meet the service's recovery objective."],
      ["Synchronous versus asynchronous replication", "Synchronous replication can wait for a standby acknowledgment and reduce acknowledged data loss, at the cost of write latency and availability when the standby is unreachable. Asynchronous replication reduces commit dependency but can lose recent acknowledged changes during failover."],
      ["Avoid split brain", "Only one writable primary should own a given data history. Promotion needs fencing or a reliable consensus/coordination mechanism to prevent an old primary from accepting writes after failover."]
    ], example: "-- PostgreSQL replication status (primary)\nSELECT application_name, state, sync_state,\n       write_lag, flush_lag, replay_lag\nFROM pg_stat_replication;", note: "High availability does not eliminate backups or the need for point-in-time recovery.", exercise: "Why is a low-latency asynchronous replica not a guarantee of zero data loss during a sudden primary failure?" },
    { title: "Streaming replication and replica lag", objective: "Understand WAL sender/receiver flow and monitor replica freshness.", content: [
      ["WAL sender to standby", "A PostgreSQL primary streams WAL to a standby, which receives and replays it. Replication slots can prevent needed WAL from being removed before a consumer receives it, but a stalled slot can fill primary storage."],
      ["Lag has several meanings", "Write, flush, and replay positions describe different stages. A replica may have received WAL but not replayed it. Measure lag in bytes and time with awareness that time estimates can be NULL when the standby is caught up or idle."],
      ["Read scaling needs consistency design", "Serving reads from replicas can reduce primary work, but clients may see stale results or read-after-write anomalies. Route consistency-sensitive reads to the primary or use a measured wait/causal strategy."]
    ], example: "-- Approximate replay delay on a standby\nSELECT now() - pg_last_xact_replay_timestamp() AS replay_delay;\n\n-- Check retained WAL slots on the primary\nSELECT slot_name, active, restart_lsn\nFROM pg_replication_slots;", note: "A replication slot can retain unlimited WAL if its consumer stops. Alert on retained bytes and storage headroom.", exercise: "A user writes a record then immediately reads from a lagging replica and sees no row. What consistency guarantee was missing?" },
    { title: "Failover, switchover and recovery", objective: "Create a controlled failover runbook with safe role transitions.", content: [
      ["Failover responds to failure", "Failover promotes a standby when the primary is unavailable or unsafe. Confirm the old primary is fenced, select the best eligible standby, promote it, update connection routing, and monitor the new primary. Document how to handle a partially reachable old primary."],
      ["Switchover is planned", "A switchover coordinates a role change while the current primary is healthy. Confirm the candidate is caught up, pause or drain writes if required by the tooling, promote, redirect clients, and verify. A planned switchover is a valuable rehearsal."],
      ["Rejoin and topology repair", "After failover, the former primary usually needs rewind or rebuild before rejoining. Verify timeline/history, replication health, backups, and monitoring. Never point an old divergent data directory at a new primary without the supported recovery procedure."]
    ], example: "-- Operational runbook outline\n1. Fence old primary\n2. Select and promote eligible standby\n3. Verify writable role and expected timeline\n4. Redirect clients and validate writes\n5. Rebuild/rejoin former primary\n6. Confirm backup and monitoring coverage", note: "Promotion commands are tooling- and topology-specific. Rehearse them on the exact supported version and automation.", exercise: "Why must the old primary be fenced before clients are redirected to a promoted standby?" },
    { title: "Connection pooling and saturation", objective: "Control connection concurrency and diagnose pool/database pressure.", content: [
      ["Connections consume resources", "Each PostgreSQL backend process has memory and scheduling cost. Hundreds of idle or bursty client connections can increase context switching and memory pressure without increasing useful throughput."],
      ["Pool at the right layer", "Application pools reuse connections; PgBouncer can pool across application instances. Transaction pooling changes session semantics: session-level settings, temporary tables, and some prepared statement patterns may not behave as expected."],
      ["Size from measured concurrency", "Estimate active work and queueing, leave administrative capacity, and cap pool wait time. Raising max_connections is not a substitute for backpressure. Monitor active/idle sessions, wait events, pool queue depth, and transaction duration."]
    ], example: "-- Session state snapshot\nSELECT state, wait_event_type, count(*)\nFROM pg_stat_activity\nGROUP BY state, wait_event_type\nORDER BY count(*) DESC;", note: "Reserve a controlled administrative path so application saturation does not lock operators out.", exercise: "Why can transaction pooling break an application that relies on a session-level SET value?" }
  ],
  operations: [
    { title: "VACUUM, dead tuples and autovacuum", objective: "Explain MVCC cleanup and keep table/index bloat under control.", content: [
      ["MVCC leaves old row versions", "PostgreSQL updates and deletes create obsolete row versions. VACUUM marks space reusable after no active snapshot can see the old versions. It usually does not return table space to the operating system."],
      ["Autovacuum is essential", "Autovacuum launches VACUUM and ANALYZE based on thresholds and table scale. Long-running transactions and replication feedback can prevent cleanup. Monitor dead tuples, vacuum progress, transaction age, and autovacuum logs."],
      ["Freeze before wraparound", "Transaction IDs are finite and must be frozen to prevent visibility wraparound. Anti-wraparound vacuum is an availability safeguard. Treat warnings as urgent; do not disable autovacuum to hide load without a reviewed alternative."]
    ], example: "VACUUM (VERBOSE, ANALYZE) app.orders;\n\nSELECT relname, n_dead_tup, last_autovacuum, last_autoanalyze\nFROM pg_stat_user_tables\nORDER BY n_dead_tup DESC;", note: "VACUUM FULL rewrites a table and takes a strong lock; it is not the routine answer to every bloat concern.", exercise: "A table has many dead tuples but autovacuum cannot remove them. Which long-lived activity could be holding back cleanup?" },
    { title: "ANALYZE, REINDEX and routine maintenance", objective: "Select maintenance actions based on symptoms and operational impact.", content: [
      ["Refresh planner statistics", "ANALYZE samples table contents to update statistics used for cardinality estimates. Autoanalyze usually handles routine changes, but a bulk load or major skew change may justify a targeted ANALYZE."],
      ["Reindex with a reason", "REINDEX rebuilds an index and can address corruption or confirmed bloat. Concurrent options reduce blocking but take longer, consume extra space, and have version-specific restrictions. Check disk headroom and dependencies first."],
      ["Maintenance needs a window and a metric", "Set lock and statement timeouts, monitor progress, test the exact command, and define abort/rollback actions. Maintenance tasks compete with application I/O and can trigger replica lag."]
    ], example: "ANALYZE app.orders;\nREINDEX INDEX CONCURRENTLY app.orders_created_at_idx;\n\nSELECT * FROM pg_stat_progress_create_index;", note: "Check the supported PostgreSQL version: progress views and concurrent DDL behavior vary.", exercise: "After a bulk import changed the data distribution, what lightweight action helps the planner make better estimates?" },
    { title: "Capacity, storage and configuration", objective: "Plan headroom and tune configuration from resource evidence.", content: [
      ["Capacity is a trend", "Track table and index growth, WAL rate, free disk, backup footprint, connection demand, and peak throughput. Estimate time to exhaustion and include growth uncertainty, failover needs, temporary files, and restore space."],
      ["Know the configuration scopes", "PostgreSQL settings can be server-wide, database-specific, role-specific, or session-specific. SHOW reveals effective values; pg_settings exposes context, source, and whether a restart is needed. A configuration change may require reload or restart."],
      ["Tune a constrained bottleneck", "Determine whether the limit is CPU, memory, storage latency, locks, network, or query shape. Change a relevant setting in small steps, preserve a baseline, and test under representative concurrency. More cache, workers, or connections is not always better."]
    ], example: "SHOW shared_buffers;\nSHOW work_mem;\n\nSELECT name, setting, unit, source, context, pending_restart\nFROM pg_settings\nWHERE name IN ('shared_buffers', 'work_mem', 'max_connections');", note: "Avoid copying configuration recipes without matching engine version, memory, concurrency, and workload assumptions.", exercise: "What measurements do you need before increasing max_connections on a memory-constrained database?" },
    { title: "Upgrades, patching and deprecation", objective: "Plan database upgrades with compatibility checks, rehearsal, and rollback.", content: [
      ["Patch and major upgrades differ", "Minor releases generally deliver fixes within a supported major line. Major upgrades can change catalogs, planner behavior, extensions, and application compatibility. Managed providers may define their own supported procedure and maintenance schedule."],
      ["Inventory dependencies first", "Check extensions, drivers, replication topology, backup/restore tools, collations, deprecated settings, and application SQL. Read release notes for every skipped version and test extensions against the target."],
      ["Rehearse and define rollback", "Restore a production-like copy, run upgrade checks, measure duration, compare query behavior, validate data, and rehearse client cutover. Logical rollback after writes have reached the new version is not automatic; define a forward-fix or data synchronization strategy."]
    ], example: "-- Upgrade rehearsal checklist\nSELECT version();\n-- inventory extensions and database sizes\n-- test restore/upgrade on a recent sanitized backup\n-- compare critical query plans and application checks", note: "A backup is only a rollback plan if you know restore duration and acceptable data loss after new writes.", exercise: "Why is switching back to an old primary difficult after the upgraded system has accepted new writes?" }
  ],
  observability: [
    { title: "Health signals and service-level indicators", objective: "Choose database and application metrics that reveal user impact.", content: [
      ["Start from user outcomes", "Measure request latency distributions, errors, throughput, and saturation. Database CPU alone cannot tell you whether users are affected; a healthy-looking average can hide p99 stalls."],
      ["Database signals explain causes", "Track connection pool wait, active sessions, lock waits, I/O latency, cache behavior, transaction age, replication lag, WAL growth, autovacuum activity, storage headroom, and backup freshness. Use rate and trend, not isolated snapshots."],
      ["Alerts need an action", "Alert on symptoms with a known owner, severity, and next diagnostic step. Use sustained thresholds or burn rates to reduce noise. A dashboard is for exploration; an alert should mean someone needs to act."]
    ], example: "-- Long-running transactions (inspect before acting)\nSELECT pid, usename, now() - xact_start AS xact_age,\n       state, wait_event_type, left(query, 120) AS query\nFROM pg_stat_activity\nWHERE xact_start IS NOT NULL\nORDER BY xact_start;", note: "Metrics can reset at restart or be cumulative. Record reset times and normalize counters before comparing rates.", exercise: "Propose one user-facing latency metric and one database saturation metric for a critical write service." },
    { title: "System catalogs and activity views", objective: "Use PostgreSQL catalogs and statistics views for safe diagnosis.", content: [
      ["Catalogs describe database objects", "pg_class, pg_attribute, pg_constraint, and information_schema expose object metadata. Information_schema is more portable but may omit details; pg_catalog is PostgreSQL-specific and richer. Use catalog views rather than parsing psql display output in automation."],
      ["Activity shows current work", "pg_stat_activity reports sessions, state, query timing, and wait events subject to role visibility. Query text may contain sensitive values; restrict access and avoid exporting it broadly."],
      ["Statistics need context", "pg_stat views are cumulative since reset and can be affected by restarts or manual resets. Track reset timestamps, snapshot consistently, and avoid interpreting counts as current rates without a time interval."]
    ], example: "SELECT schemaname, relname, seq_scan, idx_scan,\n       n_live_tup, n_dead_tup\nFROM pg_stat_user_tables\nORDER BY seq_scan DESC;", note: "Statistics views are diagnostic evidence, not a complete audit log or a perfect real-time event stream.", exercise: "Why should you note the statistics reset time before comparing a table's index scans across two snapshots?" },
    { title: "Triage: CPU, I/O, locks or connections", objective: "Use a branching diagnostic workflow instead of guessing at a slow system.", content: [
      ["Confirm scope and timing", "Identify affected applications, query fingerprints, start time, recent changes, and whether the problem is steady or bursty. Compare to a known-good baseline. Avoid restarting first; it destroys useful session and wait evidence."],
      ["Follow waits and saturation", "High CPU with runnable work suggests compute/query efficiency; high I/O latency suggests storage pressure or inefficient access; lock waits suggest blockers; pool queueing suggests connection saturation. Multiple symptoms can share a cause such as a long transaction."],
      ["Mitigate, then find cause", "Choose the smallest reversible mitigation that reduces impact: stop a runaway batch, route safe reads, add capacity, or revert a risky change. Preserve evidence, communicate status, and investigate root causes after service stabilizes."]
    ], example: "-- Waiting sessions and their blockers\nSELECT a.pid, a.wait_event_type, a.wait_event,\n       pg_blocking_pids(a.pid) AS blocking_pids,\n       left(a.query, 120) AS query\nFROM pg_stat_activity AS a\nWHERE cardinality(pg_blocking_pids(a.pid)) > 0;", note: "A blocker query can be truncated and may contain sensitive text. Protect diagnostic access and logs.", exercise: "The app pool is saturated and many database sessions are idle in transaction. What evidence ties these symptoms together?" },
    { title: "Incident command and post-incident learning", objective: "Coordinate safe response, communication and follow-up during database incidents.", content: [
      ["Separate roles during response", "Assign an incident lead to coordinate, an operator to make changes, and a communicator to update stakeholders when impact warrants it. Keep a timestamped log of observations, decisions, and commands."],
      ["Stabilize before optimizing", "Confirm impact, protect data, and reduce the blast radius. Avoid multiple simultaneous changes. State what is known, what is uncertain, and when the next update will arrive."],
      ["Improve the system afterward", "A blameless review documents timeline, contributing conditions, detection gaps, recovery effectiveness, and prioritized actions with owners. Replace hero-dependent knowledge with tested automation, alerts, and runbooks."]
    ], example: "-- Incident log\n14:05 UTC  p95 latency increased; writes still succeeding\n14:09 UTC  identified lock queue after deploy 8f3...\n14:12 UTC  paused backfill; queue trending down\n14:25 UTC  verify lag, errors, and data integrity", note: "Record commands and timestamps without copying secrets or sensitive customer data into the incident channel.", exercise: "What information should the next stakeholder update include if the root cause is not yet confirmed?" }
  ],
  automation: [
    { title: "Versioned schema migrations", objective: "Make database changes reviewable, ordered, repeatable and observable.", content: [
      ["Treat schema as code", "Store migrations in version control, review them with application changes, and apply them through a controlled identity. Each migration should state its preconditions, lock impact, expected duration, and verification."],
      ["Design forward-compatible steps", "Use expand-and-contract: add compatible structure, deploy code that supports old and new forms, backfill in bounded batches, switch reads/writes, then remove obsolete structure in a later release. Coordinate application and database rollout order."],
      ["Failure and concurrency", "Migration frameworks track applied versions, but they cannot make every DDL operation online or safe. Prevent two deployers from applying the same migration, handle partial failure, and provide an explicit recovery or forward-fix procedure."]
    ], example: "-- Migration sketch: expand first\nALTER TABLE app.customer ADD COLUMN display_name text;\n\n-- Backfill in bounded batches in application/job code\n-- Deploy readers that tolerate NULL during rollout\n-- Add/validate constraints after data is ready", note: "A single giant migration may block deploys and be hard to reverse. Large backfills should be resumable and rate-limited.", exercise: "Why should a column be added before the new application version starts selecting it?" },
    { title: "Safe automation and administrative scripts", objective: "Build scripts that are repeatable, observable and safe to stop.", content: [
      ["Make operations idempotent", "An idempotent script can be run again without duplicating harmful changes. Check actual state before acting, use stable names, and distinguish create-if-missing from silently accepting an object with the wrong definition."],
      ["Fail clearly and log decisions", "Use strict error handling, structured logs, timeouts, and exit codes. Record database, role, version, object counts, and outcome without logging passwords or sensitive row values. A script that fails silently is more dangerous than a manual task."],
      ["Limit blast radius", "Run with a narrowly scoped role, explicit target, dry-run or preview where possible, bounded batches, and a cancellation path. Test against disposable data and rehearse recovery before production scheduling."]
    ], example: "-- psql safety pattern\n\\set ON_ERROR_STOP on\nBEGIN;\n-- assertions and bounded change here\n-- COMMIT only after verification\nROLLBACK;", note: "psql meta-commands are client features. Shell quoting, environment variables, and exit handling also need security review.", exercise: "What two protections would you add to a scheduled cleanup job before allowing it to delete expired rows?" },
    { title: "Runbooks, change windows and access workflows", objective: "Document an operation so another qualified person can execute and verify it.", content: [
      ["A runbook is executable knowledge", "State when to use it, prerequisites, exact commands, expected output, decision points, abort conditions, recovery path, and escalation contact. Include commands to verify the target environment before changing anything."],
      ["Changes need ownership", "Review blast radius, dependencies, expected locks, monitoring, customer impact, and maintenance-window requirements. Coordinate application deploys, replicas, backups, and on-call coverage."],
      ["Close the loop", "After execution, verify the success criteria, check replica and backup health, clean up temporary privileges, and communicate completion. Capture surprises and update the runbook while the experience is fresh."]
    ], example: "-- Runbook header\nPurpose: add a nullable column to app.customer\nPre-check: version, table size, active locks, disk headroom\nAbort if: lock wait > 3s or replica lag > 60s\nVerify: catalog definition, app health, replica replay", note: "Use approved change tooling and credential processes; never embed a production password in a runbook.", exercise: "Name three abort conditions for a schema migration on a high-traffic table." },
    { title: "Capstone: design a production-ready database", objective: "Combine workload, access, performance, availability, operations and recovery into one design.", content: [
      ["Scenario and workload", "A subscription service stores customers, invoices, and an append-heavy audit trail. It needs read-heavy reporting, reliable payment writes, p95 latency targets, and tenant isolation. Start by clarifying volume, growth, query shapes, data sensitivity, and acceptable maintenance windows."],
      ["Choose safeguards", "Define normalized keys and constraints; separate owner, migration, runtime, and read-only roles; choose indexes from measured access patterns; define pool limits; and document the high-availability behavior. Avoid giving reporting jobs unrestricted access to payment data."],
      ["Prove operations", "Specify encrypted backups, WAL/PITR retention, RPO/RTO, tested restore drills, monitoring and alerts, a safe migration sequence, upgrade rehearsal, and incident ownership. For each decision, state the failure it addresses and the tradeoff it introduces."]
    ], example: "-- Capstone deliverables\n1. ERD + constraints + representative DDL\n2. Role/GRANT matrix and connection policy\n3. Query/index plan with measured workload assumptions\n4. Backup/PITR and failover runbooks\n5. SLO dashboard, alert actions, migration plan", note: "There is no universally correct architecture. A strong design makes assumptions explicit and demonstrates that its recovery and security claims are testable.", exercise: "Draft one-page architecture notes: workload, RPO/RTO, roles, index strategy, backup method, failover plan, top three alerts, and one upgrade rollback constraint." }
  ]
};

function replaceLessonText(unit, replacements) {
  const replaceValue = (value) => {
    if (typeof value === "string") {
      return replacements.reduce((text, [search, replacement]) => text.replaceAll(search, replacement), value);
    }
    if (Array.isArray(value)) return value.map(replaceValue);
    if (value && typeof value === "object") {
      Object.keys(value).forEach((key) => { value[key] = replaceValue(value[key]); });
    }
    return value;
  };
  replaceValue(unit);
}

const sqlServerReplacements = [
  ["PostgreSQL", "Microsoft SQL Server"],
  ["Postgres", "SQL Server"],
  ["pg_dump", "BACKUP DATABASE / BACPAC export"],
  ["pg_restore", "RESTORE DATABASE / SqlPackage import"],
  ["pg_basebackup", "BACKUP DATABASE"],
  ["pg_hba.conf", "SQL Server login and authentication configuration"],
  ["pg_stat_activity", "sys.dm_exec_sessions and sys.dm_exec_requests"],
  ["pg_stat_user_tables", "sys.dm_db_index_usage_stats and sys.dm_db_partition_stats"],
  ["pg_stat_user_indexes", "sys.dm_db_index_usage_stats"],
  ["pg_stat_replication", "sys.dm_hadr_database_replica_states"],
  ["pg_stat_replication", "sys.dm_hadr_database_replica_states"],
  ["pg_stat_statements", "Query Store and sys.dm_exec_query_stats"],
  ["pg_stat_progress_create_index", "sys.dm_exec_requests"],
  ["pg_replication_slots", "Always On availability group send and redo queues"],
  ["pg_settings", "sys.configurations"],
  ["pg_current_wal_lsn()", "sys.dm_db_log_stats(DB_ID())"],
  ["pg_database_size(current_database())", "SUM(size) from sys.database_files"],
  ["pg_last_xact_replay_timestamp()", "last_commit_time in sys.dm_hadr_database_replica_states"],
  ["pg_blocking_pids(a.pid)", "blocking_session_id from sys.dm_exec_requests"],
  ["pg_dump", "BACKUP DATABASE"],
  ["pg_restore", "RESTORE DATABASE"],
  ["pg_basebackup", "BACKUP DATABASE"],
  ["initdb", "SQL Server Setup"],
  ["pg_ctl", "SQL Server Configuration Manager or SQL Server service control"],
  ["psql", "SQL Server Management Studio (SSMS) or sqlcmd"],
  ["WAL", "transaction log"],
  ["write-ahead logging", "transaction logging"],
  ["write-ahead log", "transaction log"],
  ["WAL archiving", "transaction log backups"],
  ["WAL archive", "transaction log backup chain"],
  ["WAL segment", "transaction log backup"],
  ["WAL segments", "transaction log backups"],
  ["WAL generation", "transaction log generation"],
  ["WAL", "transaction log"],
  ["archive_command", "BACKUP LOG job"],
  ["restore_command", "RESTORE LOG sequence"],
  ["recovery.signal", "WITH STOPAT on RESTORE LOG"],
  ["archive_mode", "FULL recovery model"],
  ["streaming replication", "Always On availability groups or log shipping"],
  ["replication slots", "availability group send and redo queues"],
  ["replication slot", "availability group send and redo queue"],
  ["pg_settings.context", "sys.configurations.is_dynamic"],
  ["pending_restart", "is_dynamic and requires restart"],
  ["source to confirm", "value_in_use to confirm"],
  ["search_path", "default schema and object qualification"],
  ["ALTER DEFAULT PRIVILEGES", "schema-level GRANT strategy for future objects"],
  ["default privileges", "schema-level permissions for newly created objects"],
  ["RETURNING", "OUTPUT inserted/deleted"],
  ["ON CONFLICT", "a guarded UPDATE-then-INSERT pattern"],
  ["CREATE INDEX CONCURRENTLY", "CREATE INDEX with ONLINE = ON where supported"],
  ["partial index", "filtered index"],
  ["Partial indexes", "Filtered indexes"],
  ["Expression indexes", "Indexed computed columns"],
  ["expression index", "index on a persisted computed column"],
  ["GIN and BRIN", "columnstore, XML, and spatial indexes"],
  ["GIN", "XML or spatial"],
  ["BRIN", "columnstore"],
  ["work_mem", "query memory grants and Resource Governor"],
  ["CREATE STATISTICS", "CREATE STATISTICS"],
  ["ANALYZE", "UPDATE STATISTICS"],
  ["VACUUM", "ghost-record cleanup and index maintenance"],
  ["REINDEX", "ALTER INDEX REBUILD or REORGANIZE"],
  ["EXPLAIN ANALYZE", "an actual execution plan and SET STATISTICS IO, TIME"],
  ["EXPLAIN", "the estimated or actual execution plan"],
  ["PITR", "point-in-time recovery"],
  ["pg_database", "sys.databases"],
  ["pg_extension", "sys.dm_db_persisted_sku_features"],
  ["timestamptz", "datetime2 stored in UTC by convention"],
  ["jsonb", "nvarchar(max) with JSON functions, or a normalized table"],
  ["boolean", "bit"],
  ["pg_catalog", "sys"],
  ["pg_stat", "sys.dm_db"],
  ["pg_current", "sys.dm_db"],
  ["pg_size_pretty", "FORMAT"],
  ["pg_xact", "transaction log"]
];

const sqlServerLessonOverrides = {
  "foundations:Instance, cluster, database, schema": {
    content: [
      ["Separate logical objects from the service", "A SQL Server instance is an installed Database Engine service with its own system databases and configuration. An instance hosts databases; each database contains schemas, and schemas contain tables, views, routines, and other objects. A Windows Server Failover Cluster (WSFC) may support a failover cluster instance, but it is an availability design—not a collection of database processes."],
      ["Client and server responsibilities", "A client authenticates, sends a statement, and consumes results. The server accepts the connection, parses and optimizes the statement, executes operators, coordinates locks and transactions, reads or writes pages, and returns rows. Connection pools reduce connection churn but do not make an unbounded workload safe."],
      ["Know the deployment shape", "A self-managed server, SQL Server failover cluster instance, availability group, Azure SQL Database, and Managed Instance expose different control surfaces. Managed services may hide host access or automate failover; the DBA still owns configuration choices, access, workload behavior, and recovery verification."]
    ],
    example: "-- SQL Server scope: instance -> database -> schema -> object\nSELECT @@SERVERNAME AS instance_name,\n       DB_NAME() AS database_name,\n       SUSER_SNAME() AS login_name,\n       SCHEMA_NAME() AS default_schema;"
  },
  "foundations:The query lifecycle": {
    example: "SET STATISTICS IO, TIME ON;\nSELECT order_id, total\nFROM dbo.orders\nWHERE customer_id = 42;\n-- In SSMS, include the actual execution plan (Ctrl+M)\nSET STATISTICS IO, TIME OFF;",
    note: "The actual execution plan runs the statement. Use care with writes. SET STATISTICS IO/TIME reports logical reads and elapsed/CPU time; estimated plans do not execute."
  },
  "foundations:Pages, memory, transaction log and durability": {
    content: [
      ["Data pages and the buffer pool", "SQL Server stores database objects in 8-KB pages and caches them in the buffer pool. A logical read is a page access; a physical read requires storage. Buffer cache hits are not a goal by themselves—look at the work a query performs and at memory pressure across the instance."],
      ["The transaction log", "SQL Server records changes in the database transaction log. Under the write-ahead logging rule, required log records are hardened before the corresponding dirty data pages are written. Commit durability depends on the log flush policy and storage guarantees. The log supports crash recovery, point-in-time restore, and log shipping or availability-group data movement."],
      ["Checkpoints and recovery", "A checkpoint writes dirty pages and records a recovery boundary; crash recovery uses the log to redo and undo work as needed. Checkpoints do not replace backups. Observe log growth, checkpoint behavior, I/O latency, and recovery objectives before tuning."]
    ],
    example: "-- Current database and file sizes\nSELECT DB_NAME(database_id) AS database_name,\n       name AS logical_file_name,\n       type_desc,\n       size * 8 / 1024 AS size_mb\nFROM sys.master_files\nWHERE database_id = DB_ID();\n\nSELECT * FROM sys.dm_db_log_stats(DB_ID());",
    note: "Changing delayed durability or log flush behavior changes failure guarantees. Understand the business requirement before trading durability for latency."
  },
  "provisioning:Install and configure a SQL Server instance": {
    content: [
      ["Install the engine and tools", "Install a supported SQL Server Database Engine edition and current servicing update, then choose the instance name, service accounts, collation, authentication mode, data/log/tempdb paths, and feature set. Managed Azure SQL services abstract host setup but still require sizing, networking, identity, backup, and maintenance decisions."],
      ["Provision a new instance safely", "SQL Server Setup initializes system databases and instance configuration. It is an installer workflow, not a repair command to point at existing user database files. For recovery or migration, follow a tested restore, attach, or upgrade procedure and preserve original files until validation."],
      ["Plan database file layout", "Place data, transaction log, tempdb, and backups on supported storage according to workload and platform guidance. Pre-size files, use sensible growth increments, monitor volume headroom, and document service identity permissions and recovery ownership."]
    ],
    example: "-- Inspect instance version and edition from SSMS/sqlcmd\nSELECT @@VERSION AS version_and_edition;\nSELECT SERVERPROPERTY('Edition') AS edition,\n       SERVERPROPERTY('ProductVersion') AS product_version;\n\n-- Database files are created with CREATE DATABASE or Setup",
    note: "Do not detach or overwrite production database files to “initialize” an instance. Use SQL Server Setup for installation and RESTORE DATABASE for recovery."
  },
  "provisioning:Service lifecycle and configuration": {
    content: [
      ["Configuration sources", "SQL Server settings come from instance configuration, database options, server and database principals, session SET options, and SQL Server Agent or platform orchestration. sys.configurations shows configured and running values; database-scoped configuration may override optimizer behavior."],
      ["Dynamic changes and restarts", "Some sp_configure options take effect after RECONFIGURE; others require a SQL Server service restart. Verify the documentation for the option, inspect run_value and is_dynamic, and plan restarts around availability and failover."],
      ["Use the supported control plane", "Use SQL Server Configuration Manager for network protocols and service accounts, SSMS or sqlcmd for engine settings, SQL Server Agent for scheduled work, and the cloud provider control plane for managed instances. Verify effective settings and the SQL Server error log after changes."]
    ],
    example: "EXEC sys.sp_configure 'show advanced options', 1;\nRECONFIGURE;\nEXEC sys.sp_configure 'max server memory (MB)';\n\nSELECT name, value, value_in_use, is_dynamic\nFROM sys.configurations\nWHERE name IN ('max server memory (MB)', 'max degree of parallelism');",
    note: "Do not set max server memory to consume all host RAM; reserve capacity for Windows, drivers, backup agents, and other workloads."
  },
  "provisioning:Connect with psql and secure networking": {
    content: [
      ["Connect with SSMS or sqlcmd", "A client connection identifies a server or listener, database, principal, authentication method, and encryption policy. SSMS provides graphical administration; sqlcmd supports scripting and automation. SQL Server batch separators such as GO are recognized by tools, not sent to the engine as T-SQL statements."],
      ["Network and authentication layers", "The SQL Server instance must have the intended TCP/IP protocol enabled, a listener/port configured, and firewall rules limited to approved clients. Then authentication maps a Windows/Active Directory or SQL login to a server principal and database user. A timeout differs from a login failure or database permission error."],
      ["Require encrypted, attributable access", "Require encrypted connections with certificate validation where supported, use Windows/Entra authentication when appropriate, restrict network paths, and use individual or service-specific identities. Avoid passwords in command history, scripts, and connection strings."]
    ],
    example: "-- sqlcmd example (use approved identity and certificate)\nsqlcmd -S tcp:sql01.example.net,1433 -d AppDb -E -N\n\n-- In SSMS/sqlcmd, inspect current context\nSELECT @@SERVERNAME, DB_NAME(), SUSER_SNAME(), USER_NAME();",
    note: "Do not expose SQL Server directly to the public internet. Prefer private endpoints/networking and managed identity paths where available."
  },
  "provisioning:Extensions, locale and compatibility": {
    content: [
      ["SQL Server features and components", "SQL Server features include Query Store, full-text search, columnstore, CLR integration, and other edition- or platform-dependent capabilities. Some are enabled per database; others require installation or provider support. Inventory dependencies and licensing before enabling them."],
      ["Collation affects comparisons", "Instance and database collations govern sorting, case/accent sensitivity, and code-page behavior. Column-level collations can differ. Changing a collation can alter uniqueness and ordering assumptions; test data conflicts and index rebuild plans before migration."],
      ["Compatibility and version support", "Record engine build, database compatibility level, edition, drivers, and component versions. Compatibility level affects optimizer behavior and available T-SQL features; it does not upgrade the database engine. Test upgrades, restores, and deprecated feature removal against the exact target."]
    ],
    example: "SELECT @@VERSION;\nSELECT name, compatibility_level, collation_name\nFROM sys.databases;\n\n-- Query Store is database-scoped (SQL Server 2016+)\nALTER DATABASE AppDb SET QUERY_STORE = ON;",
    note: "Check edition, engine version, Azure SQL service tier, and compatibility level separately; feature availability differs across them."
  },
  "sql-admin:PostgreSQL SQL map for DBAs": {
    title: "T-SQL map for DBAs",
    content: [
      ["DDL, DML, DCL and transaction control", "DDL changes structures with CREATE, ALTER, DROP, and TRUNCATE. DML reads or changes rows with SELECT, INSERT, UPDATE, and DELETE; MERGE exists but deserves careful concurrency review. DCL includes GRANT, DENY, and REVOKE. Transaction control uses BEGIN TRANSACTION, COMMIT, and ROLLBACK."],
      ["T-SQL batch and result syntax", "T-SQL supports variables prefixed with @, procedural blocks, TRY/CATCH, OUTPUT for changed rows, and optional GO batch separators in SSMS/sqlcmd. WHERE limits affected rows. Schema-qualify objects such as dbo.Orders and never assume a script's current database or login."],
      ["Know the SQL Server surface", "This course teaches Microsoft SQL Server and Azure SQL T-SQL. SQL Server Management Studio, sqlcmd, SQL Server Agent, system catalog views, and Dynamic Management Views (DMVs) are common DBA tools. Azure SQL Database and Managed Instance expose different operating-system and instance-level controls."]
    ],
    example: "-- T-SQL uses schema-qualified names and batches\nSELECT TOP (20) order_id, status\nFROM dbo.Orders\nWHERE order_id = 1042;\nGO\n\nUPDATE dbo.Orders\nSET status = N'closed'\nOUTPUT inserted.order_id, inserted.status\nWHERE order_id = 1042;",
    note: "GO is a client-side batch separator used by SSMS/sqlcmd; it is not a T-SQL statement and should not be sent through application database APIs."
  },
  "sql-admin:Databases, schemas and search_path": {
    title: "Databases, schemas and default schema",
    content: [
      ["Create databases and schemas", "CREATE DATABASE creates a database inside a SQL Server instance; it is commonly issued in its own batch and cannot be wrapped in a user transaction. CREATE SCHEMA creates a namespace inside the current database. A schema can organize ownership and permissions but does not automatically isolate access."],
      ["Qualify object names", "SQL Server resolves unqualified names using the user's default schema and then dbo. Use schema-qualified names such as sales.Orders in deployment scripts and security-sensitive code to make resolution predictable and avoid accidentally targeting a same-named object."],
      ["Manage ownership intentionally", "Database ownership and schema/object ownership carry powerful control. Use a stable owner principal or dbo for application schemas, and separate ownership from the application login. Grant task-oriented permissions rather than making runtime users db_owner."]
    ],
    example: "CREATE DATABASE AppDb;\nGO\nUSE AppDb;\nGO\nCREATE SCHEMA app AUTHORIZATION dbo;\nGO\nSELECT * FROM app.Orders;",
    note: "USE and GO are batch/client constructs used in SSMS/sqlcmd. Applications should connect directly to the intended database and schema-qualify objects."
  },
  "sql-admin:CREATE TABLE, types and defaults": {
    example: "CREATE TABLE dbo.Customer (\n  CustomerId bigint IDENTITY(1,1) NOT NULL\n    CONSTRAINT PK_Customer PRIMARY KEY,\n  Email nvarchar(320) NOT NULL\n    CONSTRAINT UQ_Customer_Email UNIQUE,\n  CreatedAt datetime2(3) NOT NULL\n    CONSTRAINT DF_Customer_CreatedAt DEFAULT SYSUTCDATETIME(),\n  Status varchar(10) NOT NULL\n    CONSTRAINT CK_Customer_Status CHECK (Status IN ('active', 'paused'))\n);",
    note: "datetime2 stores no timezone offset; establish a UTC convention or use datetimeoffset when the offset itself matters. Use nvarchar for Unicode text."
  },
  "sql-admin:ALTER, INSERT, UPDATE, DELETE safely": {
    content: [
      ["Evolve schemas carefully", "ALTER TABLE can add columns, constraints, and indexes or change existing definitions. Some operations scan or rewrite large tables and acquire schema-modification locks. Check SQL Server version, edition, online-operation support, table size, lock timeout, and application compatibility before production DDL."],
      ["Preview and bound row changes", "First SELECT the exact keys using the identical predicate, verify the database and expected row count, and capture a tested recovery point. Use a short transaction where appropriate and the T-SQL OUTPUT clause to inspect inserted/deleted values. A missing WHERE clause can affect every row."],
      ["Use staged constraints for large tables", "For large production tables, add a compatible nullable shape, deploy code that tolerates both forms, backfill in bounded batches, validate with WITH CHECK, and remove the old structure in a later release. Monitor locks, log growth, and Always On send/redo queues."]
    ],
    example: "SET XACT_ABORT ON;\nBEGIN TRY\n  BEGIN TRANSACTION;\n  SELECT CustomerId FROM dbo.Customer WHERE Status = 'legacy';\n  UPDATE dbo.Customer SET Status = 'active'\n  OUTPUT inserted.CustomerId, deleted.Status, inserted.Status\n  WHERE Status = 'legacy';\n  -- Inspect row count/output before COMMIT\n  ROLLBACK TRANSACTION; -- COMMIT only after validation\nEND TRY\nBEGIN CATCH\n  IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;\n  THROW;\nEND CATCH;"
  },
  "sql-admin:Views, materialized views and sequences": {
    title: "Views, indexed views and sequences",
    content: [
      ["Views package a query", "CREATE VIEW stores a query definition, not a separate copy of its rows. It can simplify access and present a stable interface; the underlying query normally runs when the view is read. Views can expose a restricted column set when permissions are designed carefully."],
      ["Indexed views persist index structures", "SQL Server indexed views materialize results through a unique clustered index and have strict requirements for determinism, schema binding, SET options, and supported aggregates. They add write overhead and are not a drop-in equivalent to a freely refreshable materialized view."],
      ["Sequences and identity", "Sequences generate values independently of transaction rollback, so gaps are normal. Identity values can also have gaps. Do not use either as a gapless business counter. Choose IDENTITY for a table-owned surrogate key or SEQUENCE when values must be shared across objects."]
    ],
    example: "CREATE VIEW dbo.ActiveCustomer\nWITH SCHEMABINDING\nAS\n  SELECT CustomerId, Email\n  FROM dbo.Customer\n  WHERE Status = 'active';\nGO\n\n-- Indexed view requires a unique clustered index\nCREATE UNIQUE CLUSTERED INDEX CUX_ActiveCustomer\n  ON dbo.ActiveCustomer (CustomerId);",
    note: "Indexed views have edition, SET-option, determinism, and optimizer-use requirements. Check the target version and workload before adding them."
  },
  "sql-admin:INSERT, upsert, DELETE, TRUNCATE and COPY": {
    title: "INSERT, upsert, DELETE, TRUNCATE and bulk load",
    content: [
      ["Insert and upsert", "INSERT adds rows. SQL Server supports MERGE, but concurrency and trigger semantics require careful design and testing; many systems use a unique constraint plus a guarded UPDATE/INSERT transaction instead. OUTPUT exposes inserted and deleted row values."],
      ["DELETE versus TRUNCATE", "DELETE removes rows selected by a predicate and can return changed values through OUTPUT. TRUNCATE TABLE removes all rows, takes a schema modification lock, resets identity values, and has foreign-key and permission restrictions. It cannot be used when referenced by a foreign key."],
      ["Bulk loading", "BULK INSERT, bcp, and SSIS can load data efficiently. Validate file encoding, field/row terminators, identity handling, constraints, and transaction/logging behavior. Load to a staging table, validate counts and quality, then merge into production under a controlled change."]
    ],
    example: "SET XACT_ABORT ON;\nBEGIN TRANSACTION;\nUPDATE dbo.Customer WITH (UPDLOCK, HOLDLOCK)\nSET Status = N'active'\nWHERE Email = N'dba@example.test';\nIF @@ROWCOUNT = 0\n  INSERT dbo.Customer (Email, Status)\n  VALUES (N'dba@example.test', N'active');\nCOMMIT TRANSACTION;\n\nDELETE dbo.Job\nOUTPUT deleted.JobId\nWHERE ExpiresAt < SYSUTCDATETIME();",
    note: "Avoid treating MERGE or an upsert as automatically concurrency-safe. Enforce a unique key, design locking/isolation deliberately, and test simultaneous writers."
  },
  "sql-admin:Partitioning for large-table lifecycle": {
    content: [
      ["Partitioning divides one logical table", "SQL Server partitioning maps rows to partitions using a partition function and scheme, usually aligned with filegroups. Partition elimination can reduce reads when predicates constrain the partition key. Partitioning is often most valuable for manageability and sliding-window retention, not automatic query acceleration."],
      ["Keys and indexes must align", "Partitioned indexes can be aligned with the table's partition scheme. A unique partitioned index generally must include the partitioning column so uniqueness can be enforced within the aligned partitions. Design boundaries, data types, constraints, and switching requirements together."],
      ["Operate the partition lifecycle", "Create future boundaries, monitor partition distribution, and rehearse SWITCH IN/OUT with matching schemas, indexes, constraints, and filegroups. Manage retention under a reviewed policy. Partition functions and schemes affect every dependent table and index."]
    ],
    example: "CREATE PARTITION FUNCTION pfEventDate (date)\nAS RANGE RIGHT FOR VALUES ('2026-11-01');\nGO\nCREATE PARTITION SCHEME psEventDate\nAS PARTITION pfEventDate ALL TO ([PRIMARY]);\nGO\nCREATE TABLE dbo.Event (\n  EventId bigint NOT NULL,\n  OccurredAt date NOT NULL,\n  Payload nvarchar(max) NOT NULL,\n  CONSTRAINT PK_Event PRIMARY KEY CLUSTERED (OccurredAt, EventId)\n) ON psEventDate(OccurredAt);",
    note: "Partition switching is metadata-fast only when source/target structures and constraints align exactly. A partition scheme is not a backup or availability feature."
  },
  "transactions:Isolation levels and anomalies": {
    content: [
      ["Read committed", "SQL Server READ COMMITTED is the default and uses locks unless READ_COMMITTED_SNAPSHOT is enabled. With row-versioning enabled, each statement reads a versioned snapshot; without it, shared locks protect reads. Check database options before reasoning about blocking or consistency."],
      ["Repeatable read and serializable", "REPEATABLE READ holds shared locks on rows read until transaction end. SERIALIZABLE adds key-range protection to prevent phantoms, potentially increasing blocking. SNAPSHOT isolation uses row versions and requires ALLOW_SNAPSHOT_ISOLATION. Applications must handle update conflicts and retry only safe transactions."],
      ["Anomalies are workload-shaped", "Lost updates, non-repeatable reads, write skew, and phantoms depend on transaction shape and isolation. Use constraints, atomic conditional updates, locking hints only when justified, or a suitable isolation level to enforce the actual business invariant."]
    ],
    example: "SET XACT_ABORT ON;\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nBEGIN TRANSACTION;\nSELECT Available\nFROM dbo.Inventory WITH (UPDLOCK, HOLDLOCK)\nWHERE Sku = N'A17';\nUPDATE dbo.Inventory\nSET Available = Available - 1\nWHERE Sku = N'A17' AND Available > 0;\nCOMMIT TRANSACTION;",
    note: "Prefer an atomic conditional UPDATE and inspect @@ROWCOUNT for inventory changes. Locking hints can reduce concurrency; test with the real access pattern."
  },
  "transactions:Locks, blocking and deadlocks": {
    content: [
      ["Locks protect correctness", "SQL Server uses key, page, object, schema, and other lock resources. DDL may request schema-modification locks that conflict with application activity. A blocked request may be waiting on another transaction, not consuming CPU. Identify the head blocker and its transaction before acting."],
      ["Deadlocks are cycles", "A deadlock occurs when sessions hold resources each other needs. SQL Server chooses a victim and returns error 1205. Reduce risk by acquiring resources in a consistent order, keeping transactions short, and retrying the entire transaction only when safe."],
      ["Timeouts are guardrails", "SET LOCK_TIMEOUT bounds lock waiting in milliseconds; client command timeouts bound how long the caller waits. Use targeted limits for risky migrations. A timeout does not undo already committed work or replace an explicit rollback plan."]
    ],
    example: "SET LOCK_TIMEOUT 3000; -- milliseconds\n\nSELECT r.session_id, r.blocking_session_id,\n       r.wait_type, r.wait_time, r.status,\n       s.host_name, s.program_name, t.text\nFROM sys.dm_exec_requests AS r\nJOIN sys.dm_exec_sessions AS s ON s.session_id = r.session_id\nCROSS APPLY sys.dm_exec_sql_text(r.sql_handle) AS t\nWHERE r.blocking_session_id <> 0;",
    note: "Do not KILL a session until you understand the business impact and rollback cost. Termination can trigger a long rollback and additional log usage."
  },
  "security:Roles, users and ownership": {
    content: [
      ["Logins, users, and database roles", "A SQL Server login authenticates at the instance; a database user maps access inside a database. Database roles group permissions. Create functional roles such as app_reader and grant them to users; keep human, runtime, and deployment identities distinct."],
      ["Ownership is powerful", "Database and schema ownership carry broad control. Keep dbo/schema ownership with a stable principal, not an employee or runtime login. Avoid db_owner for application accounts and use controlled deployment identities for DDL."],
      ["Future objects inherit schema permissions", "Schema-level GRANTs apply to objects in that schema, including many objects created later, unlike per-object grants on only current tables. Keep object creation in intended schemas and test as the actual runtime principal."]
    ],
    example: "CREATE ROLE app_reader;\nCREATE USER reporting_user FOR LOGIN reporting_login;\nALTER ROLE app_reader ADD MEMBER reporting_user;\nGRANT SELECT ON SCHEMA::reporting TO app_reader;\nGRANT EXECUTE ON SCHEMA::reporting TO app_reader;",
    note: "Server logins and database users are separate security principals. Contained databases, Azure SQL, and Microsoft Entra authentication have different identity setup."
  },
  "security:GRANT, REVOKE and schema access": {
    content: [
      ["Permissions have multiple scopes", "A user needs CONNECT to the database, schema access where applicable, and object permissions such as SELECT or EXECUTE. Server-level permissions are separate from database permissions. Ownership chaining can affect whether underlying object checks occur."],
      ["Grant task-shaped access", "Use database roles to group permissions and choose GRANT, DENY, and REVOKE intentionally. DENY generally overrides grants through role membership, but ownership and sysadmin privileges have special behavior. Audit effective permissions and inherited memberships."],
      ["Cover future objects", "Schema-level permissions make access easier to manage as tables and procedures are added. Prefer a dedicated application schema, test ownership chaining and stored-procedure execution, and avoid granting broad permissions at database scope when a schema grant is sufficient."]
    ],
    example: "CREATE ROLE reporting_reader;\nGRANT CONNECT TO reporting_reader;\nGRANT SELECT ON SCHEMA::reporting TO reporting_reader;\nGRANT EXECUTE ON SCHEMA::reporting TO reporting_reader;\n-- Add the database user to the role\nALTER ROLE reporting_reader ADD MEMBER [reporting_user];",
    note: "REVOKE removes a specific grant; it does not necessarily remove access granted through another role, ownership, or fixed database roles."
  },
  "security:Authentication, secrets and encryption": {
    content: [
      ["Authentication proves identity", "SQL Server supports Windows/Active Directory authentication and SQL logins, with Microsoft Entra options for Azure SQL. Prefer managed identities or integrated authentication where supported. Enforce strong credential policy and disable unused or legacy authentication paths."],
      ["Transport and stored secrets", "Use encrypted connections with certificate validation, restrict network paths, and store secrets in a managed vault. Rotate credentials deliberately and ensure agent job steps, connection strings, logs, and deployment variables do not expose them."],
      ["Encryption is a lifecycle problem", "Transparent Data Encryption protects database and backup files at rest; Always Encrypted protects selected values from server-side visibility under its threat model. Neither replaces access control. Document certificate/key backup, rotation, restore permissions, and disaster recovery dependencies."]
    ],
    example: "-- Inspect encryption state (database context)\nSELECT DB_NAME(database_id) AS database_name,\n       encryption_state, key_algorithm, key_length\nFROM sys.dm_database_encryption_keys;\n\n-- Configure TLS encryption and certificate validation\n-- in the client/SQL Server network configuration",
    note: "Back up TDE certificates and private keys securely. A database backup may be unusable after disaster recovery if its encryption keys are missing."
  },
  "security:Auditing, row security and safe access": {
    content: [
      ["Audit what matters", "SQL Server Audit can capture server- and database-level actions such as role changes, privileged access, schema changes, and selected data access. Filter events to answer policy questions, restrict access to audit files, and define retention and alert ownership."],
      ["Row-level security", "SQL Server Row-Level Security uses an inline table-valued predicate function and a security policy to filter or block rows. The predicate can use SESSION_CONTEXT for tenant context, but that value must be established by trusted code and protected from user spoofing."],
      ["Prove the boundary", "Test as the actual application database user, not sysadmin or dbo. Verify allowed and denied operations, role inheritance, newly created object access, ownership behavior, audit capture, and restore/certificate workflows."]
    ],
    example: "CREATE FUNCTION Security.fn_tenant_access(@TenantId int)\nRETURNS TABLE WITH SCHEMABINDING\nAS RETURN SELECT 1 AS access_result\nWHERE @TenantId = TRY_CONVERT(int, SESSION_CONTEXT(N'TenantId'));\nGO\nCREATE SECURITY POLICY Security.TenantPolicy\nADD FILTER PREDICATE Security.fn_tenant_access(TenantId)\nON dbo.Invoice WITH (STATE = ON);",
    note: "SESSION_CONTEXT is not an authentication boundary by itself. Prevent untrusted callers from setting another tenant's context and test pooled-connection reset behavior."
  },
  "performance:Read EXPLAIN plans": {
    title: "Read estimated and actual execution plans",
    content: [
      ["Plan tree and estimates", "SQL Server's execution plan is a tree of scans, seeks, joins, sorts, aggregates, and other operators. Estimated subtree cost is a relative optimizer estimate, not elapsed time. Compare estimated rows, actual rows, and operator properties from the leaf inputs upward."],
      ["Actual plans add runtime evidence", "An actual execution plan runs the statement and reports actual rows, executions, warnings, memory grants, and spills. SET STATISTICS IO and TIME reports logical reads and CPU/elapsed time. For UPDATE or DELETE, an actual plan performs the write; use a safe transaction or staging."],
      ["Find the expensive mismatch", "A major estimate error can lead to poor join order, lookup amplification, or bad memory grants. Look for repeated key lookups, scans on large inputs, spills, implicit conversions, and excessive reads. A scan is often correct when most rows are needed."]
    ],
    example: "SET STATISTICS IO, TIME ON;\nSELECT CustomerId, SUM(Total) AS Total\nFROM dbo.Orders\nWHERE CreatedAt >= DATEADD(day, -30, SYSUTCDATETIME())\nGROUP BY CustomerId;\nSET STATISTICS IO, TIME OFF;\n-- Include Actual Execution Plan in SSMS (Ctrl+M)",
    note: "Use actual plans on writes only when you intend the write or can safely roll it back. Estimated plans do not execute the statement."
  },
  "performance:B-tree indexes and composite order": {
    example: "CREATE INDEX IX_Orders_Tenant_Created\nON dbo.Orders (TenantId, CreatedAt DESC)\nINCLUDE (Total, Status);\n\nSELECT i.name, s.user_seeks, s.user_scans, s.user_lookups, s.user_updates\nFROM sys.indexes AS i\nLEFT JOIN sys.dm_db_index_usage_stats AS s\n  ON s.object_id = i.object_id AND s.index_id = i.index_id\n AND s.database_id = DB_ID()\nWHERE i.object_id = OBJECT_ID(N'dbo.Orders');",
    note: "SQL Server supports online index operations only in supported editions/versions and with operation-specific restrictions. Verify edition and available disk before using ONLINE = ON."
  },
  "performance:Specialized indexes and expression patterns": {
    title: "Filtered, computed-column and specialized indexes",
    content: [
      ["Filtered indexes", "A filtered index stores only rows matching a predicate, such as ready jobs. It can be smaller and cheaper to maintain, but the query predicate and parameterization must allow the optimizer to prove the filter applies."],
      ["Indexed computed columns", "SQL Server can index a computed column when determinism, precision, ownership, data type, and required SET options meet its rules. Persisting a computed column stores the calculated value but adds storage and write cost."],
      ["Specialized index families", "Columnstore indexes suit analytical scans and compression; XML indexes support XML methods; spatial indexes accelerate spatial predicates; full-text indexes support linguistic search. Choose by data shape and operators. A rowstore B-tree remains the general-purpose starting point."]
    ],
    example: "CREATE INDEX IX_Job_Ready_Created\nON dbo.Job (CreatedAt)\nWHERE Status = 'ready';\n\nALTER TABLE dbo.Customer ADD EmailLower AS LOWER(Email) PERSISTED;\nCREATE INDEX IX_Customer_EmailLower ON dbo.Customer (EmailLower);\n\nCREATE NONCLUSTERED COLUMNSTORE INDEX NCCI_Event\nON dbo.Event (TenantId, EventTime, EventType);",
    note: "Filtered/computed indexes have predicate, determinism, and SET-option requirements. Validate the actual plan and writes on your supported SQL Server version."
  },
  "performance:Statistics, joins and memory pressure": {
    content: [
      ["Statistics guide estimates", "SQL Server statistics include a histogram for the leading statistics column and density information. Skew, correlation, parameter sensitivity, and stale statistics can mislead cardinality estimates. SQL Server 2019+ can use certain persisted/sample and feedback features depending on configuration."],
      ["Join methods are choices", "Nested loops work well for small outer inputs and indexed lookups; hash joins can match larger unsorted inputs with sufficient memory; merge joins can exploit ordered inputs. The correct operator depends on cardinality, indexes, and cost."],
      ["Memory grants and concurrency", "Sorts and hash joins request query memory grants. Over-grants waste workspace memory; under-grants spill to tempdb. Inspect grant requests and waits, concurrent workload, tempdb pressure, and Resource Governor before changing instance-wide memory or query settings."]
    ],
    example: "UPDATE STATISTICS dbo.Orders;\n\nSELECT TOP (20)\n       qs.total_worker_time / NULLIF(qs.execution_count, 0) AS avg_cpu,\n       qs.execution_count, qs.total_logical_reads,\n       SUBSTRING(st.text, 1, 4000) AS sql_text\nFROM sys.dm_exec_query_stats AS qs\nCROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS st\nORDER BY qs.total_worker_time DESC;",
    note: "Do not tune memory grants or max server memory from one query in isolation; include peak concurrency, buffer-pool needs, and tempdb activity."
  },
  "performance:A repeatable query tuning workflow": {
    example: "-- Query Store: inspect top resource-consuming query plans\nSELECT TOP (20) q.query_id, p.plan_id,\n       rs.avg_duration, rs.avg_cpu_time,\n       rs.avg_logical_io_reads, rs.count_executions\nFROM sys.query_store_query AS q\nJOIN sys.query_store_plan AS p ON p.query_id = q.query_id\nJOIN sys.query_store_runtime_stats AS rs ON rs.plan_id = p.plan_id\nORDER BY rs.avg_duration DESC;",
    note: "Query Store availability and catalog columns vary by SQL Server/Azure SQL version. Use it to compare plans and runtime history before forcing a plan."
  },
  "reliability:Logical and physical backups": {
    content: [
      ["Native database backups", "SQL Server native backups capture database pages and support full, differential, and transaction-log backup operations. A full backup establishes a base; differential backups capture changes since the base; log backups preserve the log chain for point-in-time recovery in FULL or BULK_LOGGED recovery models."],
      ["Logical portability", "BACPAC export/import packages schema and data for portability, commonly between SQL Server and Azure SQL. It is not a substitute for native backups, does not provide the same point-in-time restore path, and may not suit large or feature-rich databases."],
      ["Choose by recovery need", "Use native backup chains for recoverable production workloads and BACPACs for selected migration/portability cases. Include master/msdb dependencies where needed, encryption certificates, job definitions, permissions, and restore throughput in the plan."]
    ],
    example: "BACKUP DATABASE AppDb\nTO DISK = N'E:\\\\SqlBackups\\\\AppDb_full.bak'\nWITH COMPRESSION, CHECKSUM, INIT, STATS = 10;\n\nBACKUP DATABASE AppDb\nTO DISK = N'E:\\\\SqlBackups\\\\AppDb_diff.bak'\nWITH DIFFERENTIAL, COMPRESSION, CHECKSUM, STATS = 10;",
    note: "Examples use a local path for illustration only. Use protected backup storage, encryption, retention controls, monitoring, and a tested off-host restore."
  },
  "reliability:WAL archiving and point-in-time recovery": {
    title: "Recovery models, log backups and point-in-time restore",
    objective: "Explain SQL Server recovery models and restore a database to a point in time from an intact backup chain.",
    content: [
      ["Recovery models control log reuse", "SIMPLE recovery allows automatic log truncation after checkpoints but does not support transaction-log backups or point-in-time restore. FULL requires regular log backups to control log reuse and enables point-in-time recovery. BULK_LOGGED can reduce logging for certain bulk operations but limits point-in-time recovery within affected log backups."],
      ["A restore sequence follows LSNs", "Restore the full backup WITH NORECOVERY, then the latest applicable differential, then every required log backup in order. Use STOPAT on the final log backup to stop before an unwanted change. The chain requires intact files and matching LSN continuity."],
      ["Monitor log and backup health", "Track last successful full/differential/log backup, log reuse wait, log file size and used space, backup duration, oldest recoverable point, and restore drill time. A successful backup job does not prove that the restore chain reaches the target."]
    ],
    example: "ALTER DATABASE AppDb SET RECOVERY FULL;\nGO\nBACKUP LOG AppDb\nTO DISK = N'E:\\\\SqlBackups\\\\AppDb_log_1200.trn'\nWITH COMPRESSION, CHECKSUM, STATS = 10;\n\n-- Restore to a point in time from a tested chain\nRESTORE DATABASE AppDb_Recovery\nFROM DISK = N'E:\\\\SqlBackups\\\\AppDb_full.bak'\nWITH NORECOVERY, MOVE ...;\nRESTORE LOG AppDb_Recovery FROM ...\nWITH STOPAT = '2026-10-08T14:00:00', RECOVERY;",
    note: "Do not switch to FULL and assume log backups exist; take the required full backup to establish the chain. Always restore to a separate name/location for investigation."
  },
  "availability:Availability patterns and tradeoffs": {
    content: [
      ["Availability is a system property", "SQL Server high availability combines Windows Server Failover Cluster (WSFC) or platform coordination, replicas, quorum, listeners, client retry behavior, and operational ownership. A configured replica that has never been failed over may not meet recovery objectives."],
      ["Synchronous versus asynchronous commit", "Always On availability groups in synchronous-commit mode wait for a synchronous secondary to harden log records before acknowledging commit, increasing latency and dependency on replica health. Asynchronous commit reduces dependency but can lose recent changes during forced failover."],
      ["Avoid split brain", "A WSFC quorum and supported failover process help ensure one primary owns the writable database history. Forced failover may involve data loss. Plan fencing, quorum, DNS/listener routing, client retry, and operator confirmation."]
    ],
    example: "-- Primary-side AG health and queue sizes\nSELECT ar.replica_server_name,\n       drs.synchronization_state_desc,\n       drs.synchronization_health_desc,\n       drs.log_send_queue_size,\n       drs.redo_queue_size\nFROM sys.availability_replicas AS ar\nJOIN sys.dm_hadr_database_replica_states AS drs\n  ON drs.replica_id = ar.replica_id;",
    note: "Always On availability groups require supported SQL Server editions/configuration or a managed-service equivalent. Verify licensing, WSFC, endpoint, and Azure service behavior."
  },
  "availability:Streaming replication and replica lag": {
    content: [
      ["Primary log to secondary redo", "An availability group sends transaction-log blocks from the primary to a secondary. The secondary hardens the log and redoes changes into data pages. Log send queue and redo queue distinguish transport backlog from replay backlog."],
      ["Lag has several meanings", "A secondary can have received and hardened log that is not yet redone. Check synchronization state, send/redo queue sizes, last commit time where supported, and network/storage throughput. Queue sizes in KB need workload context and trend."],
      ["Read scaling needs consistency design", "Readable secondaries can offload selected read-only work, but data can lag and some features/queries are restricted. Route read-after-write and freshness-critical requests to the primary unless the application has an explicit consistency wait strategy."]
    ],
    example: "SELECT DB_NAME(drs.database_id) AS database_name,\n       ar.replica_server_name,\n       drs.synchronization_state_desc,\n       drs.log_send_queue_size,\n       drs.redo_queue_size,\n       drs.last_commit_time\nFROM sys.dm_hadr_database_replica_states AS drs\nJOIN sys.availability_replicas AS ar\n  ON ar.replica_id = drs.replica_id;",
    note: "A stalled replica can retain log or fall behind. Alert on queue growth and storage headroom; DMV visibility and columns depend on role/version."
  },
  "availability:Failover, switchover and recovery": {
    content: [
      ["Failover responds to failure", "Confirm the primary is unavailable or unsafe, quorum is healthy, the target secondary is eligible, and the data-loss risk is understood. Follow the configured automatic/manual failover mode, redirect clients through the availability-group listener, then validate writes, jobs, and backups."],
      ["Planned failover is a rehearsal", "For a planned failover, confirm synchronous health and synchronization, coordinate application traffic, fail over through supported tooling, validate the new primary, and observe client reconnection. Repeat regularly to test runbooks and application behavior."],
      ["Rejoin and topology repair", "The former primary must rejoin through the supported availability-group workflow and may need log catch-up, restore/reseed, or database reinitialization. Verify replica state, backup coverage, jobs, and monitoring before declaring the topology healthy."]
    ],
    example: "-- Runbook outline (use SSMS/approved automation)\n1. Confirm incident scope and replica synchronization\n2. Check WSFC quorum and selected failover mode\n3. Fence/stop writes to former primary as required\n4. Fail over to the eligible replica\n5. Verify listener, app writes, jobs and data\n6. Rejoin/reseed former primary and verify backups",
    note: "Failover commands and supported modes differ for AGs, failover cluster instances, Azure SQL, and Managed Instance. Rehearse your exact topology."
  },
  "availability:Connection pooling and saturation": {
    content: [
      ["Connections consume resources", "SQL Server sessions and requests use worker threads, memory, and scheduling capacity. Large connection bursts can cause THREADPOOL waits or resource pressure without increasing useful throughput."],
      ["Pool at the client layer", "ADO.NET SqlClient pools connections by connection string and identity. Reuse connections and dispose them promptly. Connection pooling is not a license to open unbounded concurrent work. SQL Server sessions can retain state, so applications must use documented driver reset behavior and avoid depending on state across pooled requests."],
      ["Size from measured concurrency", "Set application pool limits and queue timeouts, leave capacity for administration, and monitor active requests, worker usage, waits, and app-pool queue depth. Raising max worker threads or connection limits without evidence may amplify overload."]
    ],
    example: "SELECT status, COUNT(*) AS session_count\nFROM sys.dm_exec_sessions\nWHERE is_user_process = 1\nGROUP BY status;\n\nSELECT wait_type, waiting_tasks_count, wait_time_ms\nFROM sys.dm_os_wait_stats\nWHERE wait_type = N'THREADPOOL';",
    note: "Keep an administrative connection path available during saturation. Connection pooling is generally client-library behavior, not a separate SQL Server proxy.",
    exercise: "Why should an application avoid depending on session-level state surviving after a pooled connection is returned?"
  },
  "operations:VACUUM, dead tuples and autovacuum": {
    title: "Ghost records, row versioning and cleanup",
    objective: "Understand ghost cleanup and row-version retention in SQL Server.",
    content: [
      ["Deletes and updates need cleanup", "SQL Server marks deleted records or old row versions for cleanup rather than immediately removing all physical bytes. Ghost cleanup and background tasks reclaim eligible space. Long transactions and row-versioning consumers can retain versions and increase tempdb/version-store pressure."],
      ["Monitor the version store", "Snapshot isolation and read-committed snapshot store row versions in tempdb (or the persistent version store in supported Accelerated Database Recovery configurations). Track version-store growth, long-running transactions, tempdb space, and cleanup lag."],
      ["Do not confuse cleanup with shrinking", "Routine ghost cleanup does not guarantee file size returns to the operating system. Shrinking files repeatedly creates fragmentation and growth churn. Resolve the cause of retained rows, plan capacity, and reclaim disk only for a deliberate one-time space event."]
    ],
    example: "SELECT DB_NAME(database_id) AS database_name,\n       version_store_reserved_page_count * 8 / 1024 AS version_store_mb\nFROM sys.dm_db_file_space_usage;\n\nDBCC OPENTRAN (N'AppDb'); -- investigate oldest transaction",
    note: "Investigate long transactions and version-store consumers before changing cleanup behavior or shrinking files."
  },
  "operations:ANALYZE, REINDEX and routine maintenance": {
    title: "Statistics, index maintenance and integrity checks",
    content: [
      ["Refresh statistics with intent", "SQL Server automatically creates and updates statistics according to configuration and workload. UPDATE STATISTICS or sp_updatestats can refresh them after bulk changes, but full scans consume I/O and indiscriminate updates can cause recompiles."],
      ["Reorganize or rebuild from evidence", "ALTER INDEX REORGANIZE is an online leaf-level operation; REBUILD recreates an index and can be offline or online depending on edition, version, and index type. Fragmentation alone is not a universal trigger—consider page density, workload, size, and resource cost."],
      ["Check integrity and impact", "DBCC CHECKDB validates logical and physical consistency and is essential in a recovery program. Run on a schedule, understand its tempdb/snapshot space needs, and investigate errors immediately. Maintenance competes with application I/O and can grow the transaction log."]
    ],
    example: "UPDATE STATISTICS dbo.Orders;\nALTER INDEX IX_Orders_CreatedAt ON dbo.Orders REORGANIZE;\nDBCC CHECKDB (N'AppDb') WITH NO_INFOMSGS;",
    note: "Do not run an unconditional nightly rebuild of every index. Choose maintenance based on measured fragmentation/page density, workload, and edition capabilities."
  },
  "operations:Capacity, storage and configuration": {
    content: [
      ["Capacity is a trend", "Track table and index growth, transaction-log generation, free disk, backup footprint, connection demand, and peak throughput. Estimate time to exhaustion and include growth uncertainty, failover needs, temporary files, and restore space."],
      ["Know the configuration scopes", "SQL Server settings can be instance-wide, database-scoped, or session-scoped. Use sys.configurations for server-level settings and the relevant database catalog views or DATABASE SCOPED CONFIGURATION for database options. Check is_dynamic and value_in_use; some changes require a planned service restart."],
      ["Tune a constrained bottleneck", "Determine whether the constraint is CPU, memory, storage latency, locks, network, or query shape. Change a relevant setting in small steps, preserve a baseline, and test under representative concurrency. More cache, workers, or connections is not always better."]
    ],
    example: "SELECT DB_NAME(database_id) AS database_name,\n       name, type_desc, size * 8 / 1024 AS size_mb,\n       growth, is_percent_growth\nFROM sys.master_files\nORDER BY database_id, file_id;\n\nSELECT name, value, value_in_use, is_dynamic\nFROM sys.configurations\nWHERE name IN ('max server memory (MB)', 'max degree of parallelism', 'cost threshold for parallelism');",
    note: "Pre-size database files and use sensible fixed growth increments. Autogrowth is a safety net, not a capacity plan; monitor data, log, tempdb, backup, and volume headroom."
  },
  "operations:Upgrades, patching and deprecation": {
    content: [
      ["Cumulative updates and major upgrades differ", "SQL Server cumulative updates service a supported major version; a major version upgrade changes engine binaries, system databases, optimizer behavior, and supported features. Azure SQL services may apply platform updates on a managed schedule."],
      ["Inventory dependencies first", "Check edition, compatibility level, database-scoped configurations, CLR and other features, linked servers, SQL Agent jobs, SSIS/SSRS, drivers, availability groups, backup tooling, collations, and deprecated features. Read release notes for the source and target versions."],
      ["Rehearse and define rollback", "Restore a recent production-like backup on the target build, run upgrade checks, compare Query Store plans, validate jobs and application flows, and measure duration. After writes reach the upgraded system, rollback may require restore/side-by-side migration rather than switching binaries back."]
    ],
    example: "SELECT @@VERSION;\nSELECT name, compatibility_level, collation_name\nFROM sys.databases;\n\n-- Use Database Experimentation Assistant / Query Store\n-- and a tested side-by-side or in-place upgrade runbook",
    note: "A database backup is only a rollback plan if you know restore duration, key/certificate access, and acceptable loss of post-upgrade writes."
  },
  "observability:Health signals and service-level indicators": {
    content: [
      ["Start from user outcomes", "Measure request latency distributions, errors, throughput, and saturation. Database CPU alone cannot tell you whether users are affected; a healthy-looking average can hide p99 stalls."],
      ["Database signals explain causes", "Track connection-pool wait, active requests, lock waits, I/O latency, memory grants, transaction age, availability-group send/redo queues, transaction-log growth, ghost cleanup/version-store pressure, storage headroom, and backup freshness. Use rates and trends, not isolated snapshots."],
      ["Alerts need an action", "Alert on symptoms with a known owner, severity, and next diagnostic step. Use sustained thresholds or burn rates to reduce noise. A dashboard is for exploration; an alert should mean someone needs to act."]
    ]
  },
  "observability:System catalogs and activity views": {
    content: [
      ["Catalogs describe database objects", "SQL Server catalog views such as sys.objects, sys.columns, and sys.foreign_keys expose metadata about database objects. INFORMATION_SCHEMA views offer a narrower cross-vendor interface; use sys catalog views when you need SQL Server-specific details. Use catalog views rather than parsing SSMS or sqlcmd display output in automation."],
      ["Activity shows current work", "sys.dm_exec_sessions and sys.dm_exec_requests report sessions, status, query timing, and wait information subject to permission and version requirements. Query text may contain sensitive values; restrict access and avoid exporting it broadly."],
      ["Statistics need context", "Many DMV counters are cumulative since service start, database creation, or a manual reset. Track reset timestamps, snapshot consistently, and avoid interpreting counts as current rates without a time interval."]
    ],
    example: "SELECT r.session_id, r.status, r.command,\n       r.wait_type, r.blocking_session_id,\n       r.cpu_time, r.logical_reads,\n       DB_NAME(r.database_id) AS database_name,\n       s.login_name, s.host_name,\n       t.text AS batch_text\nFROM sys.dm_exec_requests AS r\nJOIN sys.dm_exec_sessions AS s ON s.session_id = r.session_id\nCROSS APPLY sys.dm_exec_sql_text(r.sql_handle) AS t;",
    note: "DMVs are diagnostic evidence, not a complete audit log; many reset at service restart. Query text can contain sensitive literal values—restrict access and sanitize exports."
  },
  "observability:Triage: CPU, I/O, locks or connections": {
    example: "SELECT r.session_id, r.blocking_session_id,\n       r.wait_type, r.wait_time, r.status,\n       DB_NAME(r.database_id) AS database_name,\n       s.host_name, s.program_name,\n       txt.text AS sql_text\nFROM sys.dm_exec_requests AS r\nJOIN sys.dm_exec_sessions AS s ON s.session_id = r.session_id\nCROSS APPLY sys.dm_exec_sql_text(r.sql_handle) AS txt\nWHERE r.blocking_session_id <> 0;",
    note: "A blocking query can contain sensitive literals. Restrict DMV access and capture only the diagnostic information needed for the incident."
  },
  "automation:Versioned schema migrations": {
    example: "SET XACT_ABORT ON;\nBEGIN TRY\n  BEGIN TRANSACTION;\n  ALTER TABLE dbo.Customer ADD DisplayName nvarchar(200) NULL;\n  COMMIT TRANSACTION;\nEND TRY\nBEGIN CATCH\n  IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;\n  THROW;\nEND CATCH;\nGO\n-- Backfill in bounded batches; deploy compatible readers first",
    note: "GO starts a new client-side batch. Migration frameworks track versions, but SQL Server DDL lock behavior and transaction support still need testing."
  },
  "automation:Safe automation and administrative scripts": {
    content: [
      ["Make operations repeatable", "An idempotent script checks current state before acting and avoids duplicate or harmful changes when rerun. Use stable object names, explicit database context, and assertions; do not silently accept an object with a different definition."],
      ["Fail clearly and log decisions", "Use TRY/CATCH, XACT_ABORT, THROW, exit codes, structured logging, and bounded timeouts. Record instance, database, identity, version, object counts, and outcome without logging secrets or sensitive rows. Scheduled jobs should notify an owner on failure."],
      ["Limit blast radius", "Run with a narrowly scoped login, explicit target, preview or dry-run where possible, bounded batches, and cancellation path. Test on disposable/restored data and rehearse recovery before production scheduling."]
    ],
    example: "SET XACT_ABORT ON;\nBEGIN TRY\n  BEGIN TRANSACTION;\n  -- Assertions and bounded T-SQL change\n  -- Verify expected @@ROWCOUNT before commit\n  COMMIT TRANSACTION;\nEND TRY\nBEGIN CATCH\n  IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;\n  THROW;\nEND CATCH;",
    note: "SQL Agent proxy credentials, PowerShell modules, sqlcmd shell quoting, and job output permissions all need security review."
  },
  "automation:Runbooks, change windows and access workflows": {
    example: "-- Runbook header\n-- Purpose: add a nullable column to app.Customer\n-- Pre-check: SQL version, table size, locks, log headroom, AG queues\n-- Abort if: lock timeout or replica queue exceeds threshold\n-- Execute through approved SSMS/sqlcmd/change tooling\n-- Verify: sys.columns, application health, AG sync, backups",
    note: "Use approved change tooling and credential processes; never embed a production password in a runbook."
  }
};

function applySqlServerTrack() {
  for (const module of modules) {
    for (const unit of curriculum[module.id]) {
      replaceLessonText(unit, sqlServerReplacements);
      const override = sqlServerLessonOverrides[`${module.id}:${unit.title}`];
      if (override) Object.assign(unit, override);
    }
  }
  curriculum.foundations[1].title = "Instance, database, schema and object";
  curriculum.foundations[1].content = sqlServerLessonOverrides["foundations:Instance, cluster, database, schema"].content;
  curriculum.foundations[1].example = sqlServerLessonOverrides["foundations:Instance, cluster, database, schema"].example;
  curriculum.foundations[1].note = "SQL Server instances contain databases; schemas organize objects within each database. Instance-level and database-level commands have different scopes.";
  curriculum.foundations[1].exercise = "A team needs separate namespaces for billing and analytics in one database. Which SQL Server object organizes them?";
  curriculum.provisioning[0].title = "Install and configure a SQL Server instance";
  curriculum.provisioning[0].objective = "Understand instance setup, database files, service accounts, and installation boundaries.";
  curriculum.provisioning[0].content = sqlServerLessonOverrides["provisioning:Install and configure a SQL Server instance"].content;
  curriculum.provisioning[0].example = sqlServerLessonOverrides["provisioning:Install and configure a SQL Server instance"].example;
  curriculum.provisioning[0].note = sqlServerLessonOverrides["provisioning:Install and configure a SQL Server instance"].note;
  curriculum.provisioning[1].content = sqlServerLessonOverrides["provisioning:Service lifecycle and configuration"].content;
  curriculum.provisioning[1].example = sqlServerLessonOverrides["provisioning:Service lifecycle and configuration"].example;
  curriculum.provisioning[1].note = sqlServerLessonOverrides["provisioning:Service lifecycle and configuration"].note;
  curriculum.provisioning[2].content = sqlServerLessonOverrides["provisioning:Connect with psql and secure networking"].content;
  curriculum.provisioning[2].example = sqlServerLessonOverrides["provisioning:Connect with psql and secure networking"].example;
  curriculum.provisioning[2].note = sqlServerLessonOverrides["provisioning:Connect with psql and secure networking"].note;
  curriculum.provisioning[3].content = sqlServerLessonOverrides["provisioning:Extensions, locale and compatibility"].content;
  curriculum.provisioning[3].example = sqlServerLessonOverrides["provisioning:Extensions, locale and compatibility"].example;
  curriculum.provisioning[3].note = sqlServerLessonOverrides["provisioning:Extensions, locale and compatibility"].note;
  curriculum["sql-admin"][0].title = sqlServerLessonOverrides["sql-admin:PostgreSQL SQL map for DBAs"].title;
  curriculum["sql-admin"][0].content = sqlServerLessonOverrides["sql-admin:PostgreSQL SQL map for DBAs"].content;
  curriculum["sql-admin"][0].example = sqlServerLessonOverrides["sql-admin:PostgreSQL SQL map for DBAs"].example;
  curriculum["sql-admin"][0].note = sqlServerLessonOverrides["sql-admin:PostgreSQL SQL map for DBAs"].note;
  curriculum["sql-admin"][1].title = sqlServerLessonOverrides["sql-admin:Databases, schemas and search_path"].title;
  curriculum["sql-admin"][1].content = sqlServerLessonOverrides["sql-admin:Databases, schemas and search_path"].content;
  curriculum["sql-admin"][1].example = sqlServerLessonOverrides["sql-admin:Databases, schemas and search_path"].example;
  curriculum["sql-admin"][1].note = sqlServerLessonOverrides["sql-admin:Databases, schemas and search_path"].note;
  curriculum["sql-admin"][1].exercise = "Why is SELECT * FROM dbo.Orders more predictable than using an unqualified Orders name in a privileged script?";
  curriculum["sql-admin"][2].example = sqlServerLessonOverrides["sql-admin:CREATE TABLE, types and defaults"].example;
  curriculum["sql-admin"][2].note = sqlServerLessonOverrides["sql-admin:CREATE TABLE, types and defaults"].note;
  curriculum["sql-admin"][3].content = sqlServerLessonOverrides["sql-admin:ALTER, INSERT, UPDATE, DELETE safely"].content;
  curriculum["sql-admin"][3].example = sqlServerLessonOverrides["sql-admin:ALTER, INSERT, UPDATE, DELETE safely"].example;
  curriculum["sql-admin"][4].title = sqlServerLessonOverrides["sql-admin:Views, materialized views and sequences"].title;
  curriculum["sql-admin"][4].content = sqlServerLessonOverrides["sql-admin:Views, materialized views and sequences"].content;
  curriculum["sql-admin"][4].example = sqlServerLessonOverrides["sql-admin:Views, materialized views and sequences"].example;
  curriculum["sql-admin"][4].note = sqlServerLessonOverrides["sql-admin:Views, materialized views and sequences"].note;
  curriculum["sql-admin"][5].title = sqlServerLessonOverrides["sql-admin:INSERT, upsert, DELETE, TRUNCATE and COPY"].title;
  curriculum["sql-admin"][5].content = sqlServerLessonOverrides["sql-admin:INSERT, upsert, DELETE, TRUNCATE and COPY"].content;
  curriculum["sql-admin"][5].example = sqlServerLessonOverrides["sql-admin:INSERT, upsert, DELETE, TRUNCATE and COPY"].example;
  curriculum["sql-admin"][5].note = sqlServerLessonOverrides["sql-admin:INSERT, upsert, DELETE, TRUNCATE and COPY"].note;
  curriculum["sql-admin"][6].content = sqlServerLessonOverrides["sql-admin:Partitioning for large-table lifecycle"].content;
  curriculum["sql-admin"][6].example = sqlServerLessonOverrides["sql-admin:Partitioning for large-table lifecycle"].example;
  curriculum["sql-admin"][6].note = sqlServerLessonOverrides["sql-admin:Partitioning for large-table lifecycle"].note;
  curriculum["sql-admin"][6].exercise = "Why must unique indexes be aligned with a SQL Server partition scheme, and what risks arise if a future partition boundary is missing?";
  curriculum.transactions[1].content = sqlServerLessonOverrides["transactions:Isolation levels and anomalies"].content;
  curriculum.transactions[1].example = sqlServerLessonOverrides["transactions:Isolation levels and anomalies"].example;
  curriculum.transactions[1].note = sqlServerLessonOverrides["transactions:Isolation levels and anomalies"].note;
  curriculum.transactions[2].content = sqlServerLessonOverrides["transactions:Locks, blocking and deadlocks"].content;
  curriculum.transactions[2].example = sqlServerLessonOverrides["transactions:Locks, blocking and deadlocks"].example;
  curriculum.transactions[2].note = sqlServerLessonOverrides["transactions:Locks, blocking and deadlocks"].note;
  curriculum.security[0].content = sqlServerLessonOverrides["security:Roles, users and ownership"].content;
  curriculum.security[0].example = sqlServerLessonOverrides["security:Roles, users and ownership"].example;
  curriculum.security[0].note = sqlServerLessonOverrides["security:Roles, users and ownership"].note;
  curriculum.security[1].content = sqlServerLessonOverrides["security:GRANT, REVOKE and schema access"].content;
  curriculum.security[1].example = sqlServerLessonOverrides["security:GRANT, REVOKE and schema access"].example;
  curriculum.security[1].note = sqlServerLessonOverrides["security:GRANT, REVOKE and schema access"].note;
  curriculum.security[2].content = sqlServerLessonOverrides["security:Authentication, secrets and encryption"].content;
  curriculum.security[2].example = sqlServerLessonOverrides["security:Authentication, secrets and encryption"].example;
  curriculum.security[2].note = sqlServerLessonOverrides["security:Authentication, secrets and encryption"].note;
  curriculum.security[3].content = sqlServerLessonOverrides["security:Auditing, row security and safe access"].content;
  curriculum.security[3].example = sqlServerLessonOverrides["security:Auditing, row security and safe access"].example;
  curriculum.security[3].note = sqlServerLessonOverrides["security:Auditing, row security and safe access"].note;
  curriculum.performance[0].title = sqlServerLessonOverrides["performance:Read EXPLAIN plans"].title;
  curriculum.performance[0].content = sqlServerLessonOverrides["performance:Read EXPLAIN plans"].content;
  curriculum.performance[0].example = sqlServerLessonOverrides["performance:Read EXPLAIN plans"].example;
  curriculum.performance[0].note = sqlServerLessonOverrides["performance:Read EXPLAIN plans"].note;
  curriculum.performance[1].example = sqlServerLessonOverrides["performance:B-tree indexes and composite order"].example;
  curriculum.performance[1].note = sqlServerLessonOverrides["performance:B-tree indexes and composite order"].note;
  curriculum.performance[2].title = sqlServerLessonOverrides["performance:Specialized indexes and expression patterns"].title;
  curriculum.performance[2].content = sqlServerLessonOverrides["performance:Specialized indexes and expression patterns"].content;
  curriculum.performance[2].example = sqlServerLessonOverrides["performance:Specialized indexes and expression patterns"].example;
  curriculum.performance[2].note = sqlServerLessonOverrides["performance:Specialized indexes and expression patterns"].note;
  curriculum.performance[3].content = sqlServerLessonOverrides["performance:Statistics, joins and memory pressure"].content;
  curriculum.performance[3].example = sqlServerLessonOverrides["performance:Statistics, joins and memory pressure"].example;
  curriculum.performance[3].note = sqlServerLessonOverrides["performance:Statistics, joins and memory pressure"].note;
  curriculum.performance[4].example = sqlServerLessonOverrides["performance:A repeatable query tuning workflow"].example;
  curriculum.performance[4].note = sqlServerLessonOverrides["performance:A repeatable query tuning workflow"].note;
  curriculum.reliability[1].content = sqlServerLessonOverrides["reliability:Logical and physical backups"].content;
  curriculum.reliability[1].example = sqlServerLessonOverrides["reliability:Logical and physical backups"].example;
  curriculum.reliability[1].note = sqlServerLessonOverrides["reliability:Logical and physical backups"].note;
  curriculum.reliability[1].exercise = "You need to restore one accidentally dropped table and recover a user database to 14:00 yesterday. How could you point-in-time restore to a separate database and then recover the required table safely?";
  curriculum.reliability[2].title = sqlServerLessonOverrides["reliability:WAL archiving and point-in-time recovery"].title;
  curriculum.reliability[2].objective = sqlServerLessonOverrides["reliability:WAL archiving and point-in-time recovery"].objective;
  curriculum.reliability[2].content = sqlServerLessonOverrides["reliability:WAL archiving and point-in-time recovery"].content;
  curriculum.reliability[2].example = sqlServerLessonOverrides["reliability:WAL archiving and point-in-time recovery"].example;
  curriculum.reliability[2].note = sqlServerLessonOverrides["reliability:WAL archiving and point-in-time recovery"].note;
  curriculum.availability[0].content = sqlServerLessonOverrides["availability:Availability patterns and tradeoffs"].content;
  curriculum.availability[0].example = sqlServerLessonOverrides["availability:Availability patterns and tradeoffs"].example;
  curriculum.availability[0].note = sqlServerLessonOverrides["availability:Availability patterns and tradeoffs"].note;
  curriculum.availability[1].content = sqlServerLessonOverrides["availability:Streaming replication and replica lag"].content;
  curriculum.availability[1].example = sqlServerLessonOverrides["availability:Streaming replication and replica lag"].example;
  curriculum.availability[1].note = sqlServerLessonOverrides["availability:Streaming replication and replica lag"].note;
  curriculum.availability[2].content = sqlServerLessonOverrides["availability:Failover, switchover and recovery"].content;
  curriculum.availability[2].example = sqlServerLessonOverrides["availability:Failover, switchover and recovery"].example;
  curriculum.availability[2].note = sqlServerLessonOverrides["availability:Failover, switchover and recovery"].note;
  curriculum.availability[3].content = sqlServerLessonOverrides["availability:Connection pooling and saturation"].content;
  curriculum.availability[3].example = sqlServerLessonOverrides["availability:Connection pooling and saturation"].example;
  curriculum.availability[3].note = sqlServerLessonOverrides["availability:Connection pooling and saturation"].note;
  curriculum.availability[3].exercise = sqlServerLessonOverrides["availability:Connection pooling and saturation"].exercise;
  curriculum.operations[0].title = sqlServerLessonOverrides["operations:VACUUM, dead tuples and autovacuum"].title;
  curriculum.operations[0].objective = sqlServerLessonOverrides["operations:VACUUM, dead tuples and autovacuum"].objective;
  curriculum.operations[0].content = sqlServerLessonOverrides["operations:VACUUM, dead tuples and autovacuum"].content;
  curriculum.operations[0].example = sqlServerLessonOverrides["operations:VACUUM, dead tuples and autovacuum"].example;
  curriculum.operations[0].note = sqlServerLessonOverrides["operations:VACUUM, dead tuples and autovacuum"].note;
  curriculum.operations[0].exercise = "A database has growing tempdb version-store usage. Which long-running transaction or row-versioning workload would you investigate first?";
  curriculum.operations[1].title = sqlServerLessonOverrides["operations:ANALYZE, REINDEX and routine maintenance"].title;
  curriculum.operations[1].content = sqlServerLessonOverrides["operations:ANALYZE, REINDEX and routine maintenance"].content;
  curriculum.operations[1].example = sqlServerLessonOverrides["operations:ANALYZE, REINDEX and routine maintenance"].example;
  curriculum.operations[1].note = sqlServerLessonOverrides["operations:ANALYZE, REINDEX and routine maintenance"].note;
  curriculum.operations[2].example = sqlServerLessonOverrides["operations:Capacity, storage and configuration"].example;
  curriculum.operations[2].content = sqlServerLessonOverrides["operations:Capacity, storage and configuration"].content;
  curriculum.operations[2].note = sqlServerLessonOverrides["operations:Capacity, storage and configuration"].note;
  curriculum.operations[2].exercise = "What measurements do you need before increasing max server memory on a memory-constrained SQL Server instance?";
  curriculum.operations[3].content = sqlServerLessonOverrides["operations:Upgrades, patching and deprecation"].content;
  curriculum.operations[3].example = sqlServerLessonOverrides["operations:Upgrades, patching and deprecation"].example;
  curriculum.operations[3].note = sqlServerLessonOverrides["operations:Upgrades, patching and deprecation"].note;
  curriculum.observability[1].example = sqlServerLessonOverrides["observability:System catalogs and activity views"].example;
  curriculum.observability[1].content = sqlServerLessonOverrides["observability:System catalogs and activity views"].content;
  curriculum.observability[1].note = sqlServerLessonOverrides["observability:System catalogs and activity views"].note;
  curriculum.observability[0].content = sqlServerLessonOverrides["observability:Health signals and service-level indicators"].content;
  curriculum.observability[2].example = sqlServerLessonOverrides["observability:Triage: CPU, I/O, locks or connections"].example;
  curriculum.observability[2].note = sqlServerLessonOverrides["observability:Triage: CPU, I/O, locks or connections"].note;
  curriculum.automation[0].example = sqlServerLessonOverrides["automation:Versioned schema migrations"].example;
  curriculum.automation[0].note = sqlServerLessonOverrides["automation:Versioned schema migrations"].note;
  curriculum.automation[1].content = sqlServerLessonOverrides["automation:Safe automation and administrative scripts"].content;
  curriculum.automation[1].example = sqlServerLessonOverrides["automation:Safe automation and administrative scripts"].example;
  curriculum.automation[1].note = sqlServerLessonOverrides["automation:Safe automation and administrative scripts"].note;
  curriculum.automation[3].example = sqlServerLessonOverrides["automation:Runbooks, change windows and access workflows"].example;
  curriculum.automation[3].note = sqlServerLessonOverrides["automation:Runbooks, change windows and access workflows"].note;
}

applySqlServerTrack();

modules.forEach((module) => {
  module.units = curriculum[module.id];
  module.lessons = module.units.length;
});

const quizQuestions = [
  { topic: "Reliability", question: "A product team can lose at most 15 minutes of committed data, but can tolerate a 2-hour recovery. Which pair expresses those limits?", options: ["RTO = 15 minutes; RPO = 2 hours", "RPO = 15 minutes; RTO = 2 hours", "Backup interval = 2 hours; RTO = 15 minutes", "RPO = 2 hours; replication lag = 15 minutes"], answer: 1, explanation: "RPO is the acceptable data-loss window (15 minutes). RTO is the acceptable time to restore service (2 hours). They describe different business needs." },
  { topic: "Performance", question: "A query plan shows a sequential scan on a tiny table with 40 rows. What is the best first response?", options: ["Create an index immediately", "Increase the database instance size", "Recognize that a scan may be cheapest, then measure the actual impact", "Rewrite the query to use SELECT *"], answer: 2, explanation: "For a tiny table, reading all pages in sequence can cost less than consulting an index. Judge the plan against the real workload and measured latency." },
  { topic: "Transactions", question: "Two concurrent transactions each update a row the other one has already locked. What is this situation called?", options: ["A cache miss", "A deadlock", "A checkpoint", "A dirty read"], answer: 1, explanation: "A deadlock is a cycle of transactions waiting on one another's locks. Engines usually detect the cycle and abort one transaction so the other can proceed." },
  { topic: "Security", question: "An analyst needs to run SELECT queries against production data. What is the safest default?", options: ["Share the application superuser credentials", "Grant a personal account the DBA role", "Use an individual identity with a scoped read-only role", "Copy production credentials into a shared notebook"], answer: 2, explanation: "A named identity and scoped read-only role support least privilege and auditing without giving the analyst write or administrative access." },
  { topic: "Operations", question: "Why can read replicas fail to protect you from an accidental DELETE?", options: ["Replicas never copy SQL changes", "The DELETE may be replicated to the replica too", "Replicas can only store indexes", "A replica is always read-only on disk"], answer: 1, explanation: "Replication copies changes—including mistakes—so it can improve availability but is not a substitute for protected backups and tested recovery." },
  { topic: "Indexing", question: "What is the most accurate description of adding an index?", options: ["It makes every query faster for free", "It can speed matching reads while adding storage and write-maintenance cost", "It replaces the need to measure a query plan", "It always forces the engine to avoid a table scan"], answer: 1, explanation: "Indexes are workload tradeoffs. They add storage and make writes more expensive, and the optimizer may still choose a scan when that is cheaper." },
  { topic: "SQL administration", question: "In T-SQL, which statement family includes CREATE TABLE and ALTER TABLE?", options: ["DML", "DDL", "DCL", "Transaction control"], answer: 1, explanation: "Data Definition Language changes database structures. CREATE, ALTER, and DROP are common DDL statements." },
  { topic: "SQL administration", question: "What is the practical effect of a table DEFAULT?", options: ["It rejects invalid explicit values", "It supplies a value when the insert omits that column", "It makes the column unique", "It converts every existing row immediately"], answer: 1, explanation: "A default supplies a value when no value is specified. Use NOT NULL, CHECK, UNIQUE, or foreign-key constraints to enforce data rules." },
  { topic: "SQL administration", question: "Why should a privileged script prefer dbo.orders over an unqualified orders name?", options: ["Qualified names always use an index", "It makes object resolution explicit and predictable", "It automatically grants access", "It makes the query portable across every database"], answer: 1, explanation: "Schema qualification makes object resolution explicit and avoids relying on the caller's default schema or ambiguous object names." },
  { topic: "Transactions", question: "A client times out while waiting for the response to COMMIT. What should the application assume?", options: ["The transaction definitely rolled back", "The transaction definitely committed", "The outcome may be unknown; reconcile by an idempotency key", "The server restarted"], answer: 2, explanation: "The commit may have succeeded even though its response was lost. A stable idempotency key lets the client query the original operation safely." },
  { topic: "Transactions", question: "Under SQL Server's default READ COMMITTED isolation, what governs whether a reader uses locks or row versions?", options: ["Whether READ_COMMITTED_SNAPSHOT is enabled for the database", "The table's clustered index", "Whether the query uses TOP", "The transaction log backup schedule"], answer: 0, explanation: "With READ_COMMITTED_SNAPSHOT OFF (the traditional default), READ COMMITTED uses shared locks. When enabled, reads use row versions. Verify the database option instead of assuming snapshot semantics." },
  { topic: "Security", question: "A SQL Server login has database access but cannot SELECT from dbo.Customer. What should you check first?", options: ["Database-user mapping and SELECT permission on the object or schema", "Superuser status", "Ownership of the SQL Server instance", "A replication slot"], answer: 0, explanation: "A server login must map to a database user, and that user needs the relevant object or schema permission directly or through role membership." },
  { topic: "Security", question: "Why grant permissions through a database role rather than granting each user separately?", options: ["Roles make every user an owner", "Role membership centralizes repeatable access management", "Roles encrypt future rows", "Roles prevent table growth"], answer: 1, explanation: "Database roles let administrators manage permissions by job function and grant/revoke membership as people change responsibilities." },
  { topic: "Performance", question: "How can you compare estimated work with actual runtime behavior in SQL Server?", options: ["Capture an actual execution plan and inspect actual versus estimated rows", "Create an index automatically", "Use only estimated cost percentages", "Run UPDATE STATISTICS without checking the plan"], answer: 0, explanation: "An actual execution plan includes runtime row counts and operator information. Use it with SET STATISTICS IO, TIME and workload context; be careful when executing write statements." },
  { topic: "Performance", question: "A query filters by tenant_id equality and a range on created_at. Which B-tree order is a sensible starting hypothesis?", options: ["(created_at, tenant_id) always", "(tenant_id, created_at)", "(status, id) regardless of workload", "One index per every column without measurement"], answer: 1, explanation: "An index beginning with the equality key, then the range key, often matches this access shape. Verify with the actual plan and workload." },
  { topic: "Recovery", question: "What is required for SQL Server point-in-time recovery in FULL recovery model?", options: ["A full backup and an unbroken sequence of transaction-log backups covering the target time", "A read-only replica alone", "A SQL view", "A CHECKPOINT command"], answer: 0, explanation: "Restore the full backup, optionally a differential, then every required log backup in order using NORECOVERY; apply the final log with STOPAT. A missing log backup breaks the chain." },
  { topic: "Operations", question: "Which command is designed to check the logical and physical integrity of a SQL Server database?", options: ["DBCC CHECKDB", "CREATE INDEX", "BACKUP LOG", "sp_who"], answer: 0, explanation: "DBCC CHECKDB checks allocation and structural consistency. Schedule it with a recovery plan, monitor duration and resource use, and investigate errors rather than treating a successful backup as a substitute." },
  { topic: "High availability", question: "What is a key risk of asynchronous replication during failover?", options: ["A recent acknowledged transaction may not yet exist on the standby", "It stops the primary from accepting writes", "It archives every backup automatically", "It prevents accidental SQL changes from propagating"], answer: 0, explanation: "Asynchronous commits do not wait for standby persistence, so some recent primary writes may be missing if that primary fails." },
  { topic: "Maintenance", question: "Which SQL Server DMV is a useful starting point for identifying requests that are blocked?", options: ["sys.dm_exec_requests, including blocking_session_id", "sys.database_files only", "A materialized view refresh", "The identity column's current value"], answer: 0, explanation: "sys.dm_exec_requests exposes active requests and blocking_session_id. Correlate it with sessions, SQL text, waits, transaction age, and impact before taking action." },
  { topic: "Migrations", question: "Why use expand-and-contract for a production schema change?", options: ["It removes the need for tests", "It keeps old and new application versions compatible during rollout", "It guarantees DDL never locks", "It eliminates backup requirements"], answer: 1, explanation: "Adding a compatible shape, deploying code, backfilling, and removing old structure later gives rolling deploys a safe overlap window." }
];

const database = {
  customers: [
    { id: 1, name: "Mina Patel", city: "Portland", plan: "Pro", joined: "2023-04-12" },
    { id: 2, name: "Theo Brooks", city: "Austin", plan: "Basic", joined: "2023-09-03" },
    { id: 3, name: "Ana Kim", city: "Portland", plan: "Pro", joined: "2024-01-19" },
    { id: 4, name: "Sam Rivera", city: "Chicago", plan: "Team", joined: "2024-05-28" },
    { id: 5, name: "Jules Martin", city: "Austin", plan: "Pro", joined: "2024-08-11" }
  ],
  orders: [
    { id: 1001, customer_id: 1, total: 149.00, status: "shipped", ordered_at: "2024-10-02" },
    { id: 1002, customer_id: 2, total: 39.00, status: "pending", ordered_at: "2024-10-03" },
    { id: 1003, customer_id: 1, total: 89.50, status: "shipped", ordered_at: "2024-10-04" },
    { id: 1004, customer_id: 4, total: 229.00, status: "processing", ordered_at: "2024-10-06" },
    { id: 1005, customer_id: 3, total: 59.00, status: "shipped", ordered_at: "2024-10-07" },
    { id: 1006, customer_id: 5, total: 119.00, status: "pending", ordered_at: "2024-10-08" }
  ],
  products: [
    { id: 10, name: "Query planner field notes", category: "Books", price: 24.00, stock: 48 },
    { id: 11, name: "Indexing lab kit", category: "Training", price: 79.00, stock: 12 },
    { id: 12, name: "Recovery drill cards", category: "Training", price: 32.00, stock: 31 },
    { id: 13, name: "Database systems handbook", category: "Books", price: 54.00, stock: 7 }
  ]
};

const moduleById = Object.fromEntries(modules.map((item) => [item.id, item]));
const content = document.getElementById("page-content");
const toastElement = document.getElementById("toast");
const savedState = loadState();
let currentPage = "overview";
let toastTimer;
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function loadState() {
  try {
    const value = JSON.parse(localStorage.getItem("dba-academy-progress") || "{}");
    return {
      completed: Array.isArray(value.completed) ? value.completed : [],
      completedLessons: Array.isArray(value.completedLessons) ? value.completedLessons : [],
      streak: Number.isFinite(value.streak) ? value.streak : 0,
      lastVisit: typeof value.lastVisit === "string" ? value.lastVisit : "",
      quizBest: Number.isFinite(value.quizBest) ? value.quizBest : 0,
      lastLesson: value.lastLesson && typeof value.lastLesson.moduleId === "string"
        ? { moduleId: value.lastLesson.moduleId, index: Number(value.lastLesson.index) || 0 }
        : null
    };
  } catch (error) {
    console.warn("Progress could not be loaded from local storage.", error);
    return { completed: [], completedLessons: [], streak: 0, lastVisit: "", quizBest: 0, lastLesson: null };
  }
}

function saveState() {
  try {
    localStorage.setItem("dba-academy-progress", JSON.stringify(savedState));
  } catch (error) {
    console.warn("Progress could not be saved to local storage.", error);
  }
}

function registerVisit() {
  const todayDate = new Date();
  const today = dateKey(todayDate);
  if (savedState.lastVisit !== today) {
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = dateKey(yesterdayDate);
    savedState.streak = savedState.lastVisit === yesterday ? savedState.streak + 1 : 1;
    savedState.lastVisit = today;
    saveState();
  }
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function courseProgress() {
  return Math.round((savedState.completedLessons.length / totalLessons()) * 100);
}

function totalLessons() {
  return modules.reduce((sum, module) => sum + module.units.length, 0);
}

function moduleDurationMinutes(module) {
  const hours = Number(module.duration.match(/(\d+)\s*hr/i)?.[1] || 0);
  const minutes = Number(module.duration.match(/(\d+)\s*min/i)?.[1] || 0);
  return hours * 60 + minutes;
}

function lessonKey(moduleId, lessonIndex) {
  return `${moduleId}:${lessonIndex}`;
}

function isLessonComplete(moduleId, lessonIndex) {
  return savedState.completedLessons.includes(lessonKey(moduleId, lessonIndex));
}

function getResumeLesson() {
  const last = savedState.lastLesson;
  if (last) {
    const module = moduleById[last.moduleId];
    if (module && module.units[last.index] && !isLessonComplete(module.id, last.index)) {
      return { module, index: last.index, unit: module.units[last.index] };
    }
  }
  for (const module of modules) {
    const index = module.units.findIndex((_, unitIndex) => !isLessonComplete(module.id, unitIndex));
    if (index >= 0) return { module, index, unit: module.units[index] };
  }
  return { module: modules[0], index: 0, unit: modules[0].units[0] };
}

function moduleCompletion(module) {
  const completed = module.units.filter((_, index) => isLessonComplete(module.id, index)).length;
  return { completed, total: module.units.length, percent: Math.round((completed / module.units.length) * 100), done: completed === module.units.length };
}

function updateProgressUI() {
  const percent = courseProgress();
  document.getElementById("sidebar-progress-label").textContent = `${percent}%`;
  document.getElementById("sidebar-progress-bar").style.width = `${percent}%`;
  document.getElementById("streak-count").textContent = String(savedState.streak);
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastElement.classList.remove("show"), 2700);
}

function setPage(page, options = {}) {
  currentPage = page;
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === (page === "lesson" ? "path" : page));
  });
  const pageNames = { overview: "Overview", path: "Learning path", lab: "T-SQL playground", quiz: "Knowledge checks", fieldguide: "Field guide", lesson: "Lesson" };
  document.getElementById("breadcrumb-current").textContent = pageNames[page] || "Overview";
  if (page === "overview") renderOverview();
  if (page === "path") renderPath();
  if (page === "lab") renderLab();
  if (page === "quiz") renderQuiz();
  if (page === "fieldguide") renderFieldGuide();
  if (page === "lesson") {
    const moduleId = options.moduleId || savedState.lastLesson?.moduleId || modules[0].id;
    if (Number.isInteger(options.lessonIndex)) {
      savedState.lastLesson = { moduleId, index: options.lessonIndex };
      saveState();
      renderLesson(moduleId, options.lessonIndex);
    } else {
      renderModuleOverview(moduleId);
    }
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function moduleCard(item) {
  const completion = moduleCompletion(item);
  const status = completion.done ? "Completed" : completion.completed ? `${completion.completed} / ${completion.total} lessons` : item.status;
  const percent = completion.percent;
  return `<article class="module-card" data-open-module="${item.id}" tabindex="0" role="button" aria-label="Open ${item.title}">
    <div class="module-top"><span class="module-icon ${item.tone}">${item.icon}</span><span class="module-status">${status}</span></div>
    <h3>${item.title}</h3><p>${item.description}</p>
    <div class="module-bottom"><span>${item.lessons} lessons · ${item.duration}</span><span class="module-progress"><span style="width:${percent}%"></span></span></div>
  </article>`;
}

function renderOverview() {
  const resume = getResumeLesson();
  const today = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  content.innerHTML = `
    <section class="overview-hero">
      <div><div class="eyebrow"><span class="eyebrow-dot"></span>YOUR DBA JOURNEY STARTS HERE</div>
        <h1 class="hero-heading">Good systems start with<br><em>good questions.</em></h1>
        <p class="hero-subtitle">You already know SQL. Now learn what keeps the database behind it alive.</p></div>
      <div class="date-label">${today.toUpperCase()}</div>
    </section>
    <section class="stats-grid" aria-label="Your learning stats">
      <div class="stat-card"><span class="stat-icon">↗</span><div class="stat-copy"><span class="stat-value">${courseProgress()}%</span><span class="stat-label">course completed</span></div><span class="stat-trend">${savedState.completedLessons.length}/${totalLessons()} LESSONS</span></div>
      <div class="stat-card"><span class="stat-icon orange">✦</span><div class="stat-copy"><span class="stat-value">${savedState.streak}</span><span class="stat-label">day learning streak</span></div><span class="stat-trend">KEEP IT UP</span></div>
      <div class="stat-card"><span class="stat-icon blue">◈</span><div class="stat-copy"><span class="stat-value">${savedState.quizBest}<span style="font-size:12px;color:#9099a2"> / ${quizQuestions.length}</span></span><span class="stat-label">best quiz score</span></div><span class="stat-trend">BEST RUN</span></div>
    </section>
    <section>
      <div class="section-heading"><h2>Pick up where you left off</h2><button class="text-link" data-page="path">View learning path →</button></div>
      <div class="continue-card">
        <div class="continue-copy"><div class="lesson-label"><span>${resume.module.level}</span> · LESSON ${String(resume.index + 1).padStart(2, "0")} OF ${resume.module.lessons}</div>
          <h3>${resume.unit.title}</h3>
          <p>${resume.unit.objective} This course teaches Microsoft SQL Server administration with T-SQL and practical SSMS/sqlcmd workflows.</p>
          <div class="lesson-meta"><span>◷ ${resume.module.duration}</span><span class="meta-dot"></span><span>${totalLessons()} detailed lessons</span><span class="meta-dot"></span><span>T-SQL track</span></div>
          <button class="button-primary" data-open-lesson="${resume.index}" data-module-id="${resume.module.id}">${savedState.completedLessons.length ? "Continue this lesson" : "Start lesson 1"} <span>→</span></button>
        </div>
        <div class="continue-visual" aria-label="Entity relationship diagram showing customers, orders and products"><div class="visual-grid"></div>
          <div class="erd"><span class="erd-line one"></span><span class="erd-line two"></span><span class="erd-tag one">1 → many</span><span class="erd-tag two">many ↔ many</span>
            <div class="erd-card customer"><h4><span>▦</span> customers</h4><p><b>PK</b> id<br>name<br>city</p></div>
            <div class="erd-card orders"><h4><span>▦</span> orders</h4><p><b>PK</b> id<br><b>FK</b> customer_id<br>total</p></div>
            <div class="erd-card product"><h4><span>▦</span> products</h4><p><b>PK</b> id<br>name<br>price</p></div>
          </div>
        </div>
      </div>
    </section>
    <section class="lower-grid">
      <div><div class="section-heading"><h2>The learning path</h2><button class="text-link" data-page="path">All modules →</button></div>
        <div class="module-grid">${modules.slice(0, 4).map(moduleCard).join("")}</div>
      </div>
      <div class="side-stack">
        <article class="shortcut-card"><div class="card-kicker">FULL-LENGTH COURSE · T-SQL TRACK</div><h3>${modules.length} modules. ${totalLessons()} lessons. Over 21 hours.</h3><p>Build skills in SQL Server administration, transactions, security, indexing, recovery, high availability, maintenance, monitoring, and safe automation.</p><div class="code-chip"><span>LEARN</span> → practice → verify</div></article>
        <article class="check-card"><div class="card-kicker">10-MINUTE KNOWLEDGE CHECK</div><h3>Ready to test your instincts?</h3><p>${quizQuestions.length} scenarios cover SQL administration, security, performance, recovery, and real production tradeoffs.</p><button class="button-secondary" data-page="quiz">Take a knowledge check <span>→</span></button></article>
      </div>
    </section>`;
}

function renderPath() {
  const percent = courseProgress();
  const completeModules = modules.filter((module) => moduleCompletion(module).done).length;
  content.innerHTML = `<section class="page-title-row"><div><div class="eyebrow"><span class="eyebrow-dot"></span>YOUR CURRICULUM</div><h1 class="hero-heading">The learning path</h1><p class="hero-subtitle">A Microsoft SQL Server DBA course taught in T-SQL: ${modules.length} modules, ${totalLessons()} lessons and over 21 hours of guided learning.</p></div></section>
    <div class="path-banner"><div><strong>${savedState.completedLessons.length} of ${totalLessons()} lessons complete · ${completeModules} of ${modules.length} modules</strong><p>Each lesson has a learning objective, detailed explanations, SQL or operational examples, and a knowledge check.</p></div><div class="progress-track"><span style="width:${percent}%"></span></div></div>
    <div class="path-list">${modules.map((item, index) => {
      const completion = moduleCompletion(item);
      const current = !completion.done && modules.find((entry) => !moduleCompletion(entry).done)?.id === item.id;
      return `<article class="path-item ${current ? "current-path" : ""}">
        <span class="path-number ${completion.done ? "done" : current ? "current" : ""}">${completion.done ? "✓" : String(index + 1).padStart(2, "0")}</span>
        <div class="path-copy"><h3>${item.title}</h3><p>${item.description}</p><div class="path-tags"><span>${completion.completed}/${item.lessons} LESSONS</span><span>${item.duration.toUpperCase()}</span><span>${item.level}</span></div></div>
        <button class="${current || completion.done ? "button-secondary" : "path-action"}" data-open-module="${item.id}">${completion.done ? "Review lessons →" : current ? "Continue →" : "View lessons →"}</button>
      </article>`;
    }).join("")}</div>`;
}

function renderModuleOverview(moduleId) {
  const module = moduleById[moduleId] || modules[0];
  const completion = moduleCompletion(module);
  content.innerHTML = `<section class="page-title-row"><div><button class="text-link" data-page="path">← All modules</button><div class="eyebrow" style="margin-top:15px"><span class="eyebrow-dot"></span>${module.level} · ${module.duration}</div><h1 class="hero-heading">${module.title}</h1><p class="hero-subtitle">${module.description} Work through each lesson in order or jump to any topic.</p></div></section>
    <div class="path-banner"><div><strong>${completion.completed} of ${completion.total} lessons complete</strong><p>About ${module.duration} of focused reading and practice.</p></div><div class="progress-track"><span style="width:${completion.percent}%"></span></div></div>
    <div class="module-lesson-list">${module.units.map((unit, index) => {
      const done = isLessonComplete(module.id, index);
      return `<article class="module-lesson-row"><span class="lesson-index ${done ? "done" : ""}">${done ? "✓" : String(index + 1).padStart(2, "0")}</span><div class="lesson-row-copy"><h3>${unit.title}</h3><p>${unit.objective}</p><span>LESSON ${index + 1} · ~${Math.round(moduleDurationMinutes(module) / module.lessons)} MIN · CONCEPTS + EXAMPLE + CHECK</span></div><button class="button-secondary" data-open-lesson="${index}" data-module-id="${module.id}">${done ? "Review →" : index === 0 && completion.completed === 0 ? "Start lesson →" : "Open lesson →"}</button></article>`;
    }).join("")}</div>`;
}

function getNextLesson(moduleId, lessonIndex) {
  const moduleIndex = modules.findIndex((module) => module.id === moduleId);
  const module = modules[moduleIndex];
  if (lessonIndex + 1 < module.units.length) return { moduleId, index: lessonIndex + 1 };
  if (moduleIndex + 1 < modules.length) return { moduleId: modules[moduleIndex + 1].id, index: 0 };
  return null;
}

function getPreviousLesson(moduleId, lessonIndex) {
  const moduleIndex = modules.findIndex((module) => module.id === moduleId);
  if (lessonIndex > 0) return { moduleId, index: lessonIndex - 1 };
  if (moduleIndex > 0) return { moduleId: modules[moduleIndex - 1].id, index: modules[moduleIndex - 1].units.length - 1 };
  return null;
}

function renderLesson(moduleId, lessonIndex) {
  const module = moduleById[moduleId] || modules[0];
  const unit = module.units[lessonIndex] || module.units[0];
  const done = isLessonComplete(module.id, lessonIndex);
  const previous = getPreviousLesson(module.id, lessonIndex);
  const next = getNextLesson(module.id, lessonIndex);
  const nextUnit = next && moduleById[next.moduleId].units[next.index];
  const completion = moduleCompletion(module);
  content.innerHTML = `<div class="lesson-navigation"><button class="text-link" data-open-module="${module.id}">← ${module.title}</button><span>${module.level} · LESSON ${lessonIndex + 1} OF ${module.lessons}</span></div>
    <section class="lesson-header"><div class="eyebrow"><span class="eyebrow-dot"></span>GUIDED DBA COURSE · MICROSOFT SQL SERVER · T-SQL</div><h1 class="hero-heading">${unit.title}</h1><p class="hero-subtitle">${unit.objective}</p><div class="lesson-meta"><span>◷ Approximately ${Math.round(moduleDurationMinutes(module) / module.lessons)} minutes</span><span class="meta-dot"></span><span>${completion.completed}/${completion.total} module lessons complete</span></div></section>
    <div class="lesson-layout"><main class="lesson-body">
      <div class="learning-objective"><strong>BY THE END OF THIS LESSON</strong><p>${unit.objective}</p></div>
      ${unit.content.map((section, index) => `<article class="lesson-section"><div class="lesson-section-number">${String(index + 1).padStart(2, "0")}</div><div><h2>${section[0]}</h2><p>${section[1]}</p></div></article>`).join("")}
      <section class="lesson-code-card"><div class="code-card-heading"><span>WORKED EXAMPLE</span><span>T-SQL · SQL SERVER</span></div><pre><code>${escapeHtml(unit.example)}</code></pre></section>
      <aside class="lesson-callout"><strong>DBA FIELD NOTE</strong><p>${unit.note}</p></aside>
      <section class="lesson-exercise"><div class="card-kicker">RETRIEVAL PRACTICE · PAUSE BEFORE REVEALING</div><h2>Check your understanding</h2><p>${unit.exercise}</p><button class="tiny-button" data-toggle-answer="${module.id}:${lessonIndex}">Reveal a model answer</button><div class="model-answer" id="answer-${module.id}-${lessonIndex}" hidden>${getModelAnswer(module.id, lessonIndex)}</div></section>
      <div class="lesson-complete-row"><button class="button-secondary" data-open-module="${module.id}">Lesson list</button><button class="button-primary" data-complete-lesson="${module.id}:${lessonIndex}">${done ? next ? "Completed · Continue →" : "Completed ✓" : "Mark complete & continue →"}</button></div>
      <div class="lesson-sequence">${previous ? `<button class="text-link" data-open-lesson="${previous.index}" data-module-id="${previous.moduleId}">← Previous: ${moduleById[previous.moduleId].units[previous.index].title}</button>` : "<span>Course introduction</span>"}${next ? `<button class="text-link" data-open-lesson="${next.index}" data-module-id="${next.moduleId}">Next: ${nextUnit.title} →</button>` : "<span>End of course · DBA capstone</span>"}</div>
    </main><aside class="lesson-aside"><article class="concept-card"><div class="card-kicker">MODULE PROGRESS</div><h3>${module.title}</h3><p>${completion.completed} / ${completion.total} lessons complete</p><div class="progress-track"><span style="width:${completion.percent}%"></span></div></article>
      <article class="concept-card"><div class="card-kicker">IN THIS COURSE</div><h3>Microsoft SQL Server is our reference engine</h3><p>Examples use SQL Server 2019+ T-SQL unless noted. Azure SQL Database and Managed Instance differ in instance-level features and operational controls. Always check your SQL Server version, edition, compatibility level, and service tier before using an operational command.</p></article>
      <article class="check-card"><div class="card-kicker">HANDS-ON PRACTICE</div><h3>Try the sample database</h3><p>The browser sandbox safely supports query practice. Production commands here are examples for study, not connected to a live database.</p><button class="button-secondary" data-page="lab">Open playground →</button></article>
    </aside></div>`;
}

function getModelAnswer(moduleId, lessonIndex) {
  const answers = {
    "foundations:0": "For example, clarify a p95 latency objective over a defined measurement window and set an RPO/RTO with the service owner. The exact numbers come from business impact, not a DBA guess.",
    "foundations:1": "Use a schema such as billing and analytics to organize namespaces in one SQL Server database; separately configure permissions if isolation is required.",
    "foundations:2": "Network transfer, application-side processing, dashboard rendering, connection queueing, or client-side pagination can make the end-to-end request slow.",
    "foundations:3": "SQL Server can harden the transaction-log record for durability while dirty data pages remain cached in the buffer pool and are written later.",
    "provisioning:0": "SQL Server Setup initializes system databases for a new instance; it cannot reconstruct the previous instance's user data. Restore from a valid backup or follow a supported attach/recovery procedure.",
    "provisioning:1": "Check sys.configurations.is_dynamic and value_in_use to see whether a setting is dynamic and whether the effective value matches the configured value; restart-only changes need a planned service restart.",
    "provisioning:2": "Investigate DNS, route/firewall/security-group rules, server listener/interface, port reachability, and TLS negotiation. Authentication happens after a connection reaches the server.",
    "provisioning:3": "Collation defines comparison and sort order. If its rules change but an index retains the previous order, index ordering may no longer match comparisons, requiring validation and rebuild.",
    "sql-admin:0": "CREATE TABLE is DDL; GRANT is DCL; UPDATE is DML; COMMIT is transaction control.",
    "sql-admin:1": "An unqualified name depends on the caller's default schema and can resolve unexpectedly; explicit schema qualification makes resolution predictable.",
    "sql-admin:2": "Use a CHECK (amount >= 0) constraint and NUMERIC(p,s) to represent exact decimal currency without binary floating-point rounding.",
    "sql-admin:3": "Preview the exact predicate and count; verify key uniqueness and scope; take a tested backup/rollback plan; perform a bounded change in a short transaction and inspect the affected-row count or OUTPUT inserted/deleted results.",
    "sql-admin:4": "An indexed view can persist and maintain precomputed results, but it has SCHEMABINDING, determinism, SET-option, and write-maintenance requirements. Validate the restrictions and workload before using one.",
    "sql-admin:5": "Add a UNIQUE constraint on the stable customer key (for example email or source_system_id), then use a transactionally safe MERGE or guarded UPDATE/INSERT pattern with a deliberate duplicate policy. Validate import row counts and capture rejected records.",
    "sql-admin:6": "The engine needs the partition key in the uniqueness definition to guarantee the same key cannot exist in different partitions without checking every child. A missing range partition can reject new inserts; monitor ahead and create partitions before their bounds are needed.",
    "transactions:0": "The open transaction can retain locks, log records, and (when row-versioning isolation is enabled) row versions while waiting on an unpredictable human response, blocking other work.",
    "transactions:1": "Use a unique constraint or an atomic conditional update with affected-row validation; locking or SERIALIZABLE may be appropriate depending on the invariant.",
    "transactions:2": "Inspect blocker and waiter identities, transaction age, query, business impact, lock type, and whether canceling triggers a large rollback.",
    "transactions:3": "A timeout may occur after commit succeeded but before the client received the response. A unique idempotency/request key lets the retry locate the original operation.",
    "security:0": "The runtime login should receive only runtime privileges. A separate non-login owner limits damage from compromised app credentials and avoids coupling ownership to a service identity.",
    "security:1": "Check that the login maps to the intended database user, that the database is accessible, and that the user has SELECT through an object/schema grant or database-role membership. Verify the execution context and ownership chain too.",
    "security:2": "Ensure the recovery environment can retrieve the right key, decrypt the backup, and follow the same authorization and rotation process even if production is unavailable.",
    "security:3": "Review who can alter or disable the security policy, who has broad database permissions, and which execution contexts access the table. Test the predicate with every application and administrative role; do not treat row-level security as a substitute for least privilege.",
    "performance:0": "The planner's cardinality estimate may be badly wrong because statistics are stale, sampled poorly, or unable to represent skew/correlation.",
    "performance:1": "For example, (tenant_id, created_at DESC) supports tenant equality followed by a date range and newest-first ordering.",
    "performance:2": "A clustered columnstore index can be effective for large analytical scans and compression; validate rowstore access patterns and write requirements before choosing it.",
    "performance:3": "Inspect actual plans, row estimates, spills, concurrency, and memory-grant feedback. First reduce unnecessary rows/sorts and correct estimates; treat Resource Governor or server memory changes as workload-wide decisions with measured rollback criteria.",
    "performance:4": "Capture representative read latency/calls and actual-plan plus STATISTICS IO/TIME data, along with insert/update latency, transaction-log generation, index size, and replica send/redo queues before and after.",
    "reliability:0": "Logical mistakes and deletes replicate; corruption may spread; compromised credentials can access both. Without protected backups, PITR, and an isolated failure domain these remain risks.",
    "reliability:1": "A full database backup and an unbroken transaction-log backup chain in FULL recovery model enable point-in-time restore. For object-level recovery, restore to a separate database or use a tested export/restore workflow.",
    "reliability:2": "A missing required transaction-log backup breaks the restore chain; restore only to the last point covered by an unbroken sequence.",
    "reliability:3": "Validate recovery timestamp and data, constraints/business invariants, application role connectivity/permissions, and elapsed restore time against RTO.",
    "availability:0": "With asynchronous-commit availability groups, a primary can acknowledge commits before the secondary hardens or redoes them; forced failover can lose recent transactions.",
    "availability:1": "A write acknowledged on the primary may not yet have been replayed by the replica. Route read-after-write requests to the primary or wait for a consistency condition.",
    "availability:2": "After a forced failover, isolate and prevent writes to the former primary before bringing it back; otherwise stale data or divergent writes can complicate reseeding and recovery.",
    "availability:3": "Connection pooling reuses physical SQL Server connections. Avoid relying on undocumented session state across requests; ensure the driver resets state, and use transaction-scoped settings where possible.",
    "operations:0": "A long-running transaction can retain locks and delay log truncation or version-store cleanup, depending on workload and database options. Inspect transaction age, waits, and log reuse wait before intervening.",
    "operations:1": "Update statistics after the bulk import when automatic statistics maintenance has not kept pace; compare plans and row estimates afterward.",
    "operations:2": "Measure peak active connections, backend memory, pool queue and wait, CPU/memory headroom, workload concurrency, and connection churn first.",
    "operations:3": "New writes on the upgraded primary are not automatically present on the old primary; reverting can discard them or create divergent histories.",
    "observability:0": "For example, measure p95/p99 write request latency and the application pool wait/queue depth or database lock-wait time.",
    "observability:1": "Catalog statistics are cumulative; the same idx_scan count means different rates over one minute versus one month, and a reset invalidates comparison.",
    "observability:2": "A sleeping session with an open transaction can retain locks and log records; row-versioning options can also retain old versions. Inspect open-transaction age and impact before terminating it.",
    "observability:3": "State observed impact, current mitigation, what is known versus unconfirmed, whether data is safe, and the next update time.",
    "automation:0": "The old application version must continue working while new schema is introduced; adding the column first keeps the rollout backward-compatible.",
    "automation:1": "Use a least-privilege identity, dry-run/preview, bounded batches, explicit retention predicate, row-count guardrail, logging, and a tested restore/recovery path.",
    "automation:2": "Examples: lock timeout exceeded, replica lag above threshold, unexpected affected-row count, low disk headroom, or application error-rate increase.",
    "automation:3": "A strong answer states workload and assumptions, measurable RPO/RTO, separate roles, workload-driven indexes, protected backups and tested failover, actionable alerts, and a realistic rollback/forward-fix limitation."
  };
  return answers[`${moduleId}:${lessonIndex}`] || "A good answer ties the concept to a measurable workload or failure mode, names the relevant database behavior, and includes a way to verify the result safely.";
}

function renderLab() {
  content.innerHTML = `<section class="page-title-row"><div><div class="eyebrow"><span class="eyebrow-dot"></span>SAFE TO EXPERIMENT</div><h1 class="hero-heading">T-SQL playground</h1><p class="hero-subtitle">Practice SQL Server-style SELECT syntax with a tiny sample database. This in-browser simulator is not connected to SQL Server.</p></div><button class="button-secondary" data-page="fieldguide">Read field guide →</button></section>
    <div class="lab-layout">
      <section class="lab-panel">
        <div class="lab-toolbar"><div class="lab-toolbar-title"><span class="live-dot"></span>T-SQL practice simulator <span style="color:#6f7982">·</span> sample_store</div><div class="lab-toolbar-right"><button class="tiny-button" id="reset-query">Reset</button><button class="tiny-button run" id="run-query">▶ Run query</button></div></div>
        <div class="editor-wrap"><textarea id="sql-editor" class="sql-editor" spellcheck="false" aria-label="T-SQL practice query editor" placeholder="-- Try a query, then press Ctrl + Enter&#10;SELECT TOP (5) name, city, plan&#10;FROM customers&#10;WHERE plan = 'Pro'&#10;ORDER BY name;"></textarea></div>
        <div class="lab-footer"><span>In-browser T-SQL subset · SELECT only · not a SQL Server connection</span><span>Ctrl + Enter to run</span></div>
        <div id="query-result" class="result-area"><div class="result-heading">RESULTS</div><div class="result-message">Your result will appear here. Start with the example query or choose a hint.</div></div>
      </section>
      <aside>
        <div class="schema-panel"><h3>Sample schema</h3><p>Three related tables · rows reset on refresh</p>
          <div class="schema-table"><h4>customers <span>5 ROWS</span></h4><p><b>id</b> · name · city<br>plan · joined</p></div>
          <div class="schema-table"><h4>orders <span>6 ROWS</span></h4><p><b>id</b> · customer_id · total<br>status · ordered_at</p></div>
          <div class="schema-table"><h4>products <span>4 ROWS</span></h4><p><b>id</b> · name · category<br>price · stock</p></div>
          <div class="schema-tip"><strong>Practice focus:</strong> filter rows, sort results, and summarize a column. Try linking customers to orders with a JOIN as a thought exercise.</div>
          <div class="lab-hints"><button class="hint-button" data-query="SELECT name, city, plan FROM customers WHERE plan = 'Pro' ORDER BY name;">01 · Filter customers by plan</button><button class="hint-button" data-query="SELECT status, total FROM orders WHERE total > 100 ORDER BY total DESC;">02 · Find larger orders</button><button class="hint-button" data-query="SELECT COUNT(*) AS order_count FROM orders;">03 · Count the orders</button><button class="hint-button" data-query="SELECT AVG(price) AS average_price FROM products;">04 · Calculate average price</button></div>
          <div class="challenge-card"><div class="card-kicker">YOUR MINI-CHALLENGE</div><p>Find all Pro customers in Portland, then sort them by when they joined.</p></div>
        </div>
      </aside>
    </div>`;
  document.getElementById("sql-editor").value = "SELECT name, city, plan\nFROM customers\nWHERE plan = 'Pro'\nORDER BY name;";
}

function renderQuiz() {
  if (quizIndex >= quizQuestions.length) {
    savedState.quizBest = Math.max(savedState.quizBest, quizScore);
    saveState();
    updateProgressUI();
    content.innerHTML = `<section class="page-title-row"><div><div class="eyebrow"><span class="eyebrow-dot"></span>KNOWLEDGE CHECK</div><h1 class="hero-heading">Good thinking, DBA.</h1><p class="hero-subtitle">Use what you learned, then revisit the concepts that need another pass.</p></div></section>
      <div class="quiz-summary"><div class="summary-mark">${quizScore >= 4 ? "✦" : "↗"}</div><h2>${quizScore} out of ${quizQuestions.length} correct</h2><p>${quizScore === quizQuestions.length ? "A perfect run. You are reasoning about tradeoffs, not memorizing magic answers." : "Every miss is useful information. Review the explanations, then take another run when you’re ready."}</p><button class="button-primary" data-quiz-restart>Try again</button> <button class="button-secondary" data-page="path" style="margin-left:6px">Explore lessons</button></div>`;
    return;
  }
  const question = quizQuestions[quizIndex];
  const progress = (quizIndex / quizQuestions.length) * 100;
  content.innerHTML = `<section class="page-title-row"><div><div class="eyebrow"><span class="eyebrow-dot"></span>SHORT SCENARIOS, REAL DBA TRADEOFFS</div><h1 class="hero-heading">Knowledge checks</h1><p class="hero-subtitle">A quick check of your instincts. Read the why, not just the score.</p></div><button class="text-link" data-page="fieldguide">Open field guide →</button></section>
    <div class="quiz-progress"><span>QUESTION ${String(quizIndex + 1).padStart(2, "0")} / ${String(quizQuestions.length).padStart(2, "0")}</span><div class="progress-track"><span style="width:${progress}%"></span></div><span>${quizScore} CORRECT</span></div>
    <div class="quiz-layout"><section class="quiz-card"><div class="question-type">${question.topic} · SCENARIO</div><h2>${question.question}</h2><div class="answer-list">${question.options.map((option, index) => `<button class="answer-option" data-answer="${index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join("")}</div>
      <div id="quiz-feedback"></div><div class="quiz-bottom"><span>${quizAnswered ? "Nice work—take the idea with you." : "Choose the best answer to reveal the reasoning."}</span><button class="button-primary" id="quiz-next" ${quizAnswered ? "" : "disabled style=\"opacity:.45;cursor:not-allowed\""}>${quizIndex === quizQuestions.length - 1 ? "See your results" : "Next question"} →</button></div>
    </section><aside class="quiz-aside">
      <article class="concept-card"><div class="card-kicker">A DBA'S MENTAL MODEL</div><h3>Tradeoffs over trivia</h3><p>Most database decisions depend on workload, risk, and recovery needs. The useful question is “what does this choice make better—and what does it cost?”</p><div class="flow-diagram"><span class="flow-node">Read speed</span><span class="flow-arrow">↔</span><span class="flow-node">Write cost</span></div></article>
      <article class="concept-card"><div class="card-kicker">NO PENALTIES HERE</div><h3>Misses are signals</h3><p>Each answer includes an explanation. Revisit a lesson or the field guide whenever you want a second look.</p></article>
    </aside></div>`;
}

function renderFieldGuide() {
  content.innerHTML = `<section class="page-title-row"><div><div class="eyebrow"><span class="eyebrow-dot"></span>KEEP THIS CLOSE</div><h1 class="hero-heading">The DBA field guide</h1><p class="hero-subtitle">Mental models, diagnostic flows and small habits that save real time.</p></div><button class="button-secondary" data-page="lab">Practice in the sandbox →</button></section>
    <div class="guide-grid">
      <article class="guide-card"><span class="guide-tag">INCIDENT RESPONSE</span><h3>Slow query: where do I look?</h3><p>Follow evidence in order. Avoid tuning a guess.</p><div class="decision-tree"><div class="decision-question">Is the latency real and repeatable?</div><div class="decision-branches"><div class="decision-leaf"><b>NO / UNKNOWN</b>Check client timing, sample window & baseline</div><div class="decision-leaf"><b>YES</b>Capture the plan and actual row counts</div></div><div class="decision-question">Where is time being spent?</div><div class="decision-branches"><div class="decision-leaf"><b>WAITING</b>Check locks, I/O and connections</div><div class="decision-leaf"><b>WORKING</b>Inspect scans, joins & estimates</div></div></div></article>
      <article class="guide-card"><span class="guide-tag">RECOVERY</span><h3>Choose a recovery approach</h3><p>Start from the business target; then check the failure mode.</p><div class="guide-steps"><div class="guide-step"><span>01</span><div>Agree on RPO (data loss) and RTO (downtime).</div></div><div class="guide-step"><span>02</span><div>For selected rows or objects, consider logical recovery.</div></div><div class="guide-step"><span>03</span><div>For instance loss, restore a physical backup and logs.</div></div><div class="guide-step"><span>04</span><div>Validate the restore and practice the handoff.</div></div></div></article>
      <article class="guide-card"><span class="guide-tag">SAFE SCHEMA CHANGE</span><h3>Expand → migrate → contract</h3><p>Keep old and new application versions compatible during rollout.</p><div class="flow-diagram" style="flex-wrap:wrap;margin-top:18px"><span class="flow-node">Add new column</span><span class="flow-arrow">→</span><span class="flow-node">Deploy compatible code</span><span class="flow-arrow">→</span><span class="flow-node">Backfill in batches</span><span class="flow-arrow">→</span><span class="flow-node">Remove old shape later</span></div><div class="schema-tip" style="margin-top:17px"><strong>Why it helps:</strong> a rollback does not suddenly depend on a column that has already disappeared.</div></article>
      <article class="guide-card"><span class="guide-tag">SMALL SHORTCUTS, BIG WINS</span><h3>Habits of an effective operator</h3><p>Make the next step easier before you need it.</p><div class="shortcut-list"><div class="shortcut-row"><code>Actual plan · Ctrl+M</code><span>See the executed plan in SSMS; compare estimates with actual rows.</span></div><div class="shortcut-row"><code>TOP (20)</code><span>Explore unfamiliar data without pulling every row.</span></div><div class="shortcut-row"><code>Read-only role</code><span>Safer access for exploration and reporting.</span></div><div class="shortcut-row"><code>One change</code><span>Change one thing at a time to learn what mattered.</span></div><div class="shortcut-row"><code>Restore drill</code><span>Turn backup confidence into measured evidence.</span></div></div></article>
      <article class="guide-card"><span class="guide-tag">TRANSACTIONS</span><h3>What happens when a transaction runs?</h3><p>Atomicity means all its changes take effect, or none do.</p><div class="flow-diagram" style="flex-wrap:wrap;margin-top:18px"><span class="flow-node">BEGIN</span><span class="flow-arrow">→</span><span class="flow-node">Read / write</span><span class="flow-arrow">→</span><span class="flow-node">COMMIT<br>or ROLLBACK</span></div><div class="guide-steps"><div class="guide-step"><span>!</span><div>Long transactions hold locks and can delay other work.</div></div><div class="guide-step"><span>↔</span><div>Isolation level influences what concurrent transactions observe.</div></div></div></article>
      <article class="guide-card"><span class="guide-tag">DESIGN PRINCIPLE</span><h3>Least privilege in practice</h3><p>Access should match a task, and the identity should make sense later in an audit.</p><div class="guide-steps"><div class="guide-step"><span>01</span><div>Use separate accounts for people, applications and migrations.</div></div><div class="guide-step"><span>02</span><div>Grant permissions through named roles, not shared superusers.</div></div><div class="guide-step"><span>03</span><div>Review access when responsibilities or services change.</div></div></div></article>
    </div>`;
}

function runQuery(rawSql) {
  const sql = rawSql.trim().replace(/;$/, "").trim();
  if (!sql) throw new Error("Write a SELECT query first.");
  if (sql.includes(";") || /--|\/\*/.test(sql)) throw new Error("Run one query at a time. Comments and multiple statements are not supported in this practice sandbox.");
  const topMatch = sql.match(/^SELECT\s+TOP\s*(?:\(\s*(\d+)\s*\)|(\d+))\s+/i);
  const query = topMatch ? `SELECT ${sql.slice(topMatch[0].length)}` : sql;
  const match = query.match(/^SELECT\s+(.+?)\s+FROM\s+([a-z_][a-z0-9_]*)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+([a-z_][a-z0-9_]*)(?:\s+(ASC|DESC))?)?$/i);
  if (!match) throw new Error("Try SELECT [TOP (n)] columns FROM table, with optional WHERE and ORDER BY clauses. JOINs and GROUP BY are not included in this in-browser T-SQL subset.");
  const [, selection, tableName, whereClause, sortColumn, sortDirection] = match;
  const limitText = topMatch ? topMatch[1] || topMatch[2] : "";
  const table = database[tableName.toLowerCase()];
  if (!table) throw new Error(`Unknown table "${tableName}". Choose customers, orders or products.`);
  let rows = table.slice();
  if (whereClause) {
    const conditions = whereClause.split(/\s+AND\s+/i);
    for (const condition of conditions) {
      const conditionMatch = condition.trim().match(/^([a-z_][a-z0-9_]*)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*(?:N?'([^']*)'|"([^"]*)"|(\d+(?:\.\d+)?)|(NULL))$/i);
      if (!conditionMatch) throw new Error("WHERE supports simple comparisons joined by AND, for example: WHERE city = 'Portland' AND id > 1.");
      const [, column, operator, singleQuoted, doubleQuoted, numeric, nullValue] = conditionMatch;
      assertColumn(table[0], column);
      const expected = nullValue ? null : numeric !== undefined ? Number(numeric) : singleQuoted ?? doubleQuoted;
      rows = rows.filter((row) => {
        const actual = row[column];
        if (operator.toUpperCase() === "LIKE") {
          const pattern = String(expected).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".");
          return new RegExp(`^${pattern}$`, "i").test(String(actual));
        }
        if (operator === "=") return actual === expected || String(actual).toLowerCase() === String(expected).toLowerCase();
        if (operator === "!=" || operator === "<>") return actual !== expected && String(actual).toLowerCase() !== String(expected).toLowerCase();
        if (operator === ">") return actual > expected;
        if (operator === "<") return actual < expected;
        if (operator === ">=") return actual >= expected;
        return actual <= expected;
      });
    }
  }
  if (sortColumn) {
    assertColumn(table[0], sortColumn);
    const direction = sortDirection?.toUpperCase() === "DESC" ? -1 : 1;
    rows.sort((a, b) => {
      if (a[sortColumn] === b[sortColumn]) return 0;
      return (a[sortColumn] > b[sortColumn] ? 1 : -1) * direction;
    });
  }
  const aggregateMatch = selection.trim().match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(\*|[a-z_][a-z0-9_]*)\s*\)(?:\s+AS\s+([a-z_][a-z0-9_]*))?$/i);
  if (aggregateMatch) {
    const [, operation, column, alias] = aggregateMatch;
    if (column !== "*") assertColumn(table[0], column);
    const values = column === "*" ? rows : rows.map((row) => Number(row[column])).filter(Number.isFinite);
    let value;
    switch (operation.toUpperCase()) {
      case "COUNT": value = rows.length; break;
      case "SUM": value = values.reduce((sum, item) => sum + item, 0); break;
      case "AVG": value = values.length ? Number((values.reduce((sum, item) => sum + item, 0) / values.length).toFixed(2)) : null; break;
      case "MIN": value = values.length ? Math.min(...values) : null; break;
      default: value = values.length ? Math.max(...values) : null;
    }
    return { columns: [alias || `${operation.toLowerCase()}${column === "*" ? "_all" : `_${column}`}`], rows: [{ [alias || `${operation.toLowerCase()}${column === "*" ? "_all" : `_${column}`}`]: value }], total: 1 };
  }
  if (limitText) rows = rows.slice(0, Math.min(Number(limitText), 100));
  let columns;
  if (selection.trim() === "*") columns = Object.keys(table[0]);
  else {
    columns = selection.split(",").map((part) => part.trim());
    for (const column of columns) {
      if (!/^[a-z_][a-z0-9_]*$/i.test(column)) throw new Error("Select column names separated by commas, or use SELECT *.");
      assertColumn(table[0], column);
    }
  }
  return { columns, rows: rows.map((row) => Object.fromEntries(columns.map((column) => [column, row[column]]))), total: rows.length };
}

function assertColumn(row, column) {
  if (!Object.prototype.hasOwnProperty.call(row, column)) throw new Error(`Unknown column "${column}". Check the sample schema.`);
}

function renderQueryResult(result) {
  const output = document.getElementById("query-result");
  const header = `<div class="result-heading">RESULTS <span style="float:right">${result.total} ROW${result.total === 1 ? "" : "S"}</span></div>`;
  const table = `<div class="table-scroll"><table class="result-table"><thead><tr>${result.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${result.rows.map((row) => `<tr>${result.columns.map((column) => `<td>${escapeHtml(String(row[column] ?? "NULL"))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  output.innerHTML = header + table;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function runEditorQuery() {
  const editor = document.getElementById("sql-editor");
  if (!editor) return;
  const output = document.getElementById("query-result");
  try {
    renderQueryResult(runQuery(editor.value));
  } catch (error) {
    output.innerHTML = `<div class="result-heading">QUERY HELP</div><div class="result-message error">${escapeHtml(error.message)}</div>`;
  }
}

function answerQuestion(choice) {
  if (quizAnswered) return;
  const question = quizQuestions[quizIndex];
  quizAnswered = true;
  const correct = choice === question.answer;
  if (correct) quizScore += 1;
  document.querySelectorAll(".answer-option").forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
    else if (index === choice) button.classList.add("incorrect");
  });
  const feedback = document.getElementById("quiz-feedback");
  feedback.className = `quiz-feedback ${correct ? "" : "wrong"}`;
  feedback.textContent = `${correct ? "That’s right. " : "Not quite. "} ${question.explanation}`;
  const next = document.getElementById("quiz-next");
  next.disabled = false;
  next.style.opacity = "1";
  next.style.cursor = "pointer";
  next.textContent = quizIndex === quizQuestions.length - 1 ? "See your results →" : "Next question →";
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, [data-open-module]");
  if (!target) return;
  if (target.dataset.page) {
    setPage(target.dataset.page);
    return;
  }
  if (target.dataset.openLesson !== undefined) {
    setPage("lesson", {
      moduleId: target.dataset.moduleId,
      lessonIndex: Number(target.dataset.openLesson)
    });
    return;
  }
  if (target.dataset.openModule) {
    setPage("lesson", { moduleId: target.dataset.openModule });
    return;
  }
  if (target.dataset.completeLesson) {
    const [moduleId, rawIndex] = target.dataset.completeLesson.split(":");
    const lessonIndex = Number(rawIndex);
    const key = lessonKey(moduleId, lessonIndex);
    if (!isLessonComplete(moduleId, lessonIndex)) {
      savedState.completedLessons.push(key);
      saveState();
      updateProgressUI();
      const completion = moduleCompletion(moduleById[moduleId]);
      showToast(completion.done ? `${moduleById[moduleId].title} complete. Excellent work.` : `Lesson complete · ${completion.completed} of ${completion.total} in this module.`);
    }
    const next = getNextLesson(moduleId, lessonIndex);
    if (next) setPage("lesson", { moduleId: next.moduleId, lessonIndex: next.index });
    else renderLesson(moduleId, lessonIndex);
    return;
  }
  if (target.dataset.toggleAnswer) {
    const [moduleId, lessonIndex] = target.dataset.toggleAnswer.split(":");
    const answer = document.getElementById(`answer-${moduleId}-${lessonIndex}`);
    const isHidden = answer.hidden;
    answer.hidden = !isHidden;
    target.textContent = isHidden ? "Hide model answer" : "Reveal a model answer";
    return;
  }
  if (target.dataset.answer !== undefined) {
    answerQuestion(Number(target.dataset.answer));
    return;
  }
  if (target.id === "quiz-next") {
    if (!quizAnswered) return;
    quizIndex += 1;
    quizAnswered = false;
    renderQuiz();
    return;
  }
  if (target.hasAttribute("data-quiz-restart")) {
    quizIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    renderQuiz();
    return;
  }
  if (target.id === "run-query") {
    runEditorQuery();
    return;
  }
  if (target.id === "reset-query") {
    document.getElementById("sql-editor").value = "SELECT name, city, plan\nFROM customers\nWHERE plan = 'Pro'\nORDER BY name;";
    document.getElementById("query-result").innerHTML = '<div class="result-heading">RESULTS</div><div class="result-message">Query reset. Press Run query to see the results.</div>';
    return;
  }
  if (target.dataset.query) {
    const editor = document.getElementById("sql-editor");
    editor.value = target.dataset.query;
    editor.focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches(".module-card") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    setPage("lesson", { moduleId: event.target.dataset.openModule });
  }
  if (event.target.matches(".module-lesson-row") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    setPage("lesson", { moduleId: event.target.dataset.moduleId, lessonIndex: Number(event.target.dataset.lessonIndex) });
  }
  if (event.target.id === "sql-editor" && event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    runEditorQuery();
  }
  if (event.target.id === "sql-editor" && event.key === "Tab") {
    event.preventDefault();
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    event.target.setRangeText("  ", start, end, "end");
  }
});

document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => setPage(item.dataset.page)));
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  setPage("overview");
});

const searchDialog = document.getElementById("search-dialog");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchItems = [
  ...modules.map((item) => ({ title: item.title, type: "Module", page: "lesson", moduleId: item.id, keywords: `${item.id} ${item.description}` })),
  ...modules.flatMap((module) => module.units.map((unit, index) => ({
    title: unit.title,
    type: "Lesson",
    page: "lesson",
    moduleId: module.id,
    lessonIndex: index,
    keywords: `${unit.objective} ${unit.content.map((section) => `${section[0]} ${section[1]}`).join(" ")}`
  }))),
  { title: "T-SQL playground", type: "Practice", page: "lab", keywords: "T-SQL SQL Server query select filter database customers orders products" },
  { title: "Knowledge checks", type: "Practice", page: "quiz", keywords: "quiz test questions" },
  { title: "The DBA field guide", type: "Reference", page: "fieldguide", keywords: "recovery performance indexing operations shortcuts" },
  { title: "RPO and RTO", type: "Concept", page: "lesson", moduleId: "reliability", keywords: "recovery point time data loss downtime" },
  { title: "Indexing and query plans", type: "Concept", page: "lesson", moduleId: "performance", keywords: "explain scan query optimize" },
  { title: "Least privilege", type: "Concept", page: "lesson", moduleId: "security", keywords: "roles access permissions" }
];

function updateSearchResults(query = "") {
  const normalized = query.trim().toLowerCase();
  const matches = normalized ? searchItems.filter((item) => `${item.title} ${item.type} ${item.keywords}`.toLowerCase().includes(normalized)) : searchItems.slice(0, 6);
  searchResults.innerHTML = matches.length ? matches.map((item, index) => `<button class="search-result" data-search-result="${index}"><span>${escapeHtml(item.title)}</span><span>${item.type}</span></button>`).join("") : '<div class="empty-search">No matches yet. Try “index”, “recovery”, or “SQL”.</div>';
  searchResults.querySelectorAll("[data-search-result]").forEach((button, index) => {
    button.addEventListener("click", () => {
      const result = matches[index];
      searchDialog.close();
      setPage(result.page, { moduleId: result.moduleId, lessonIndex: result.lessonIndex });
    });
  });
}

document.getElementById("search-open").addEventListener("click", () => {
  searchDialog.showModal();
  searchInput.value = "";
  updateSearchResults();
  searchInput.focus();
});
searchInput.addEventListener("input", () => updateSearchResults(searchInput.value));
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (!searchDialog.open) document.getElementById("search-open").click();
  }
});

registerVisit();
updateProgressUI();
renderOverview();
