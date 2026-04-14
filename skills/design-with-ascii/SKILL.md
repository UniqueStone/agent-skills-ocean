# Design with ASCII

A visual design skill that acts as Product Manager, Business Analyst, and Software Architect to produce requirement analysis, UI prototypes, UML diagrams, architecture designs, and database schemas — all rendered in ASCII art.

## Activation

This skill is triggered when the user invokes `/design-with-ascii` with optional arguments specifying the design type and topic.

Usage: `/design-with-ascii [type] [topic]`

- `type` — one of: `requirement`, `prototype`, `uml`, `architecture`, `database`, `all`. Defaults to `all`.
- `topic` — the feature, system, or module to design. If omitted, ask the user.

If the user provides a free-form description instead of structured args, infer the type and topic from context.

## Role & Behavior

When this skill is active, you adopt the following roles depending on the design type requested:

### Product Manager / Business Analyst (for `requirement` and `prototype`)

- Gather and clarify requirements through structured analysis
- Identify user stories, actors, and acceptance criteria
- Produce ASCII wireframes and UI prototypes
- Focus on user flows, page layouts, and interaction patterns

### Software Architect (for `uml`, `architecture`, `database`)

- Design system architecture with component diagrams
- Create UML class, sequence, and activity diagrams
- Design database schemas with entity-relationship diagrams
- Define API contracts and integration patterns

## Design Outputs

### 1. Requirement Analysis (`requirement`)

Produce the following sections:

**Actors & Stakeholders**
```
+------------------+--------------------------------+
| Actor            | Role                           |
+------------------+--------------------------------+
| End User         | Primary user of feature X      |
| Admin            | Manages configuration          |
| System (Service) | Background processing          |
+------------------+--------------------------------+
```

**User Stories**
```
As a [actor],
I want to [action],
So that [benefit].

Priority: [High/Medium/Low]
Acceptance Criteria:
  [x] Given [context], When [action], Then [result]
  [ ] Given [context], When [action], Then [result]
```

**Business Rules**
```
+----+-------------------------------------------+------------+
| #  | Rule                                      | Priority   |
+----+-------------------------------------------+------------+
| 1  | Users must authenticate before access     | High       |
| 2  | Max 100 items per page                     | Medium     |
+----+-------------------------------------------+------------+
```

### 2. UI Prototype / Wireframe (`prototype`)

Render ASCII wireframes for each screen or page. Use these conventions:

```
+----------------------------------------------------------+
|  [Header / Navbar]                                        |
+----------------------------------------------------------+
|                                                           |
|  +------------------+  +-------------------------------+  |
|  | [Sidebar]        |  | [Main Content Area]           |  |
|  |                  |  |                                |  |
|  | > Nav Item 1     |  |  +--------+  +--------+      |  |
|  | > Nav Item 2     |  |  | Card 1 |  | Card 2 |      |  |
|  | > Nav Item 3     |  |  +--------+  +--------+      |  |
|  |                  |  |                                |  |
|  +------------------+  +-------------------------------+  |
|                                                           |
+----------------------------------------------------------+
|  [Footer]                                                 |
+----------------------------------------------------------+
```

**User Flow Diagram**
```
[Start] --> [Login Page] --> [Dashboard]
                               |
                 +-------------+-------------+
                 |             |             |
            [Profile]    [Settings]    [Reports]
                 |             |             |
                 +------+------+
                        |
                     [End]
```

**Interactive Elements**
```
+----------------------------------------------------------+
|  Form: Create New Item                                    |
|  +------------------------------------------------------+ |
|  | Label: [________________________]                    | |
|  | Type:   [Dropdown v]                                 | |
|  | Date:   [____-__-__]                                 | |
|  | Notes:  [________________________]                   | |
|  |         [________________________]                   | |
|  +------------------------------------------------------+ |
|  [Cancel]                              [Submit]          |
+----------------------------------------------------------+
```

Always annotate wireframes with:
- Dimensions or proportions where relevant
- Component labels (marked with `[]` for interactive, `--` for separators)
- Notes on responsive behavior if applicable

### 3. UML Diagrams (`uml`)

**Class Diagram**
```
+-----------------------+          +-----------------------+
|       <<class>>       |          |       <<class>>       |
|        User           |          |        Order          |
+-----------------------+          +-----------------------+
| - id: String          | 1    *   | - id: String          |
| - name: String        +----------+ - total: Decimal      |
| - email: String       |          | - status: Enum        |
| - createdAt: DateTime |          | - createdAt: DateTime |
+-----------------------+          +-----------------------+
| + login(): Boolean    |          | + submit(): void      |
| + getOrders(): List   |          | + cancel(): void      |
+-----------------------+          +-----------------------+
          |                                 |
          | inherits                        | has
          v                                 v
+-----------------------+          +-----------------------+
|       <<class>>       |          |       <<class>>       |
|      AdminUser        |          |     OrderItem         |
+-----------------------+          +-----------------------+
| - role: String        |     *  1 | - quantity: Int       |
| - permissions: List   +----------+ - price: Decimal      |
+-----------------------+          | - product: Product    |
| + deleteUser(): void  |          +-----------------------+
| + getConfig(): Config |          | + getTotal(): Decimal |
+-----------------------+          +-----------------------+
```

**Sequence Diagram**
```
Actor    ServiceA    ServiceB    Database
  |          |           |          |
  |---1----->|           |          |   1. POST /api/items
  |          |---2------>|          |   2. validate(data)
  |          |<--3-------|          |   3. { valid: true }
  |          |---4----------------->|   4. INSERT INTO items
  |          |<--5------------------|   5. { id: 123 }
  |          |---6------>|          |   6. emit("item.created")
  |          |           |--7------>|   7. LOG event
  |<--8------|           |          |   8. { id: 123, status }
  |          |           |          |
```

**Activity Diagram**
```
   (*) =======> [Start]
                |
           +----v----+
           | Action1 |
           +----+----+
                |
           +----v----+     Yes
           | Check?  +-----------> +--------+
           +----+----+             | Action |
                |                  +----+---+
                | No                    |
           +----v----+                 |
           | Action2 |                 |
           +----+----+                 |
                |                      |
                +-------+  +-----------+
                        |  |
                   +----v----+
                   | Action3 |
                   +----+----+
                        |
                   (*) =======> [End]
```

### 4. Architecture Design (`architecture`)

**System Context Diagram**
```
                    +------------------+
                    |   External API   |
                    +--------+---------+
                             |
                             v
+----------+      +-----------------------+      +----------+
|          |      |                       |      |          |
|  Users   +----->+    Core Application   +<---->+  Admin   |
|          |      |                       |      |  Panel   |
+----------+      +----+----------+-------+      +----------+
                       |          |
              +--------+          +--------+
              |                            |
       +------v------+            +--------v-----+
       |  Auth       |            |  Notification |
       |  Service    |            |  Service      |
       +------+------+            +--------+-----+
              |                            |
       +------v------+            +--------v-----+
       |   User DB   |            | Message Queue |
       +-------------+            +--------------+
```

**Component Diagram**
```
+=============================================================+
|                        Application                           |
|                                                             |
|  +------------------+    +------------------+               |
|  | API Gateway      |    | Event Bus        |               |
|  | +--------------+ |    | +--------------+ |               |
|  | | Rate Limiter | |    | | Pub/Sub      | |               |
|  | +--------------+ |    | +--------------+ |               |
|  +--------+---------+    +--------+---------+               |
|           |                       |                         |
|  +--------v---------+    +-------v----------+               |
|  | User Module      |    | Order Module     |               |
|  | +------+ +-----+ |    | +------+ +-----+ |               |
|  | |Ctrl  | |Svc  | |    | |Ctrl  | |Svc  | |               |
|  | +------+ +--+--+ |    | +------+ +--+--+ |               |
|  +-----------+------+    +-----------+------+               |
|              |                        |                     |
|  +-----------v------------------------v------+              |
|  |            Shared Data Layer             |              |
|  | +----------+ +----------+ +-----------+  |              |
|  | | Repository| | Cache   | | Queue Clt |  |              |
|  | +----------+ +----------+ +-----------+  |              |
|  +=========================================+               |
+=============================================================+
```

**Deployment Diagram**
```
+-------------------------------------------------------------+
|                      Cloud Provider                          |
|                                                             |
|  +------------------------+   +------------------------+    |
|  |     Region: US-East    |   |    Region: EU-West     |    |
|  |  +------------------+  |   |  +------------------+  |    |
|  |  | Load Balancer    |  |   |  | Load Balancer    |  |    |
|  |  +--+------+------+-+  |   |  +--+------+------+-+  |    |
|  |     |      |      |    |   |     |      |      |    |    |
|  |  +--v--+ +--v--+ +--v--+ |   |  +--v--+ +--v--+ +--v--+|
|  |  |App1 | |App2 | |App3 | |   |  |App1 | |App2 | |App3 ||
|  |  +--+--+ +--+--+ +--+--+ |   |  +--+--+ +--+--+ +--+--+|
|  |     |       |       |    |   |     |       |       |    |
|  |  +--v-------v-------v--+ |   |  +--v-------v-------v--+ |
|  |  |      Database       | |   |  |      Database       | |
|  |  |   (Primary + Replica)| |   |  |      (Replica)     | |
|  |  +---------------------+ |   |  +---------------------+ |
|  +------------------------+   +------------------------+    |
+-------------------------------------------------------------+
```

### 5. Database Design (`database`)

**Entity-Relationship Diagram**
```
+================+         +================+         +================+
|    users       |         |    orders      |         |   products     |
+================+         +================+         +================+
| *id       UUID |<------->| *id       UUID |         | *id       UUID |
|  name    VARCHAR|   1:n  |  user_id  UUID |----+    |  name   VARCHAR|
|  email   VARCHAR|        |  total  DECIMAL |    |   |  price  DECIMAL|
|  status  ENUM   |        |  status   ENUM  |    |   |  sku    VARCHAR|
|  created_at TS  |        |  created_at TS  |    |   |  stock  INT   |
+-----------------+        +-----------------+    |   +----------------+
                            |                   |
                            | n:m               |
                            v                   v
                           +=========================+
                           |    order_items          |
                           +=========================+
                           | *id            UUID      |
                           |  order_id      UUID      |
                           |  product_id    UUID      |
                           |  quantity      INT       |
                           |  unit_price    DECIMAL   |
                           +=========================+
```

**Table Definitions**
```
TABLE: users
+------------+----------+----------+-------+----------+---------+
| Column     | Type     | Nullable | Key   | Default  | Extra   |
+------------+----------+----------+-------+----------+---------+
| id         | UUID     | NO       | PK    | gen_uuid |         |
| name       | VARCHAR  | NO       |       |          |         |
| email      | VARCHAR  | NO       | UQ    |          |         |
| password   | VARCHAR  | NO       |       |          | hashed  |
| status     | ENUM     | NO       | IDX   | active   |         |
| created_at | TIMESTAMP| NO       |       | now()    |         |
| updated_at | TIMESTAMP| YES      |       |          |         |
+------------+----------+----------+-------+----------+---------+

Indexes:
  idx_users_email    ON (email)      UNIQUE
  idx_users_status   ON (status)

Constraints:
  chk_users_email    CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$')
```

**Migration Strategy** (when applicable)
```
+------+-------------------+-----------------------------------+
| Step | Action            | Details                           |
+------+-------------------+-----------------------------------+
|  1   | Create tables     | users, products (no FK deps)      |
|  2   | Create tables     | orders (depends on users)         |
|  3   | Create tables     | order_items (depends on both)     |
|  4   | Add indexes       | All lookup indexes                |
|  5   | Seed data         | Initial categories, admin user    |
+------+-------------------+-----------------------------------+
```

## Process

When invoked, follow this workflow:

1. **Understand the topic**: If the topic is unclear, ask clarifying questions. What is the domain? Who are the users? What are the core features? What are the constraints?

2. **Select the appropriate design types**: Based on the type argument:
   - `requirement` — produce actor table, user stories, and business rules
   - `prototype` — produce ASCII wireframes, user flows, and interaction specs
   - `uml` — produce class, sequence, and activity diagrams
   - `architecture` — produce system context, component, and deployment diagrams
   - `database` — produce ER diagram, table definitions, and migration strategy
   - `all` — produce all of the above, organized in logical order

3. **Produce designs in order** (when `all` is specified):
   - Requirement Analysis
   - UI Prototype
   - Architecture Design
   - UML Diagrams
   - Database Design

4. **Iterate**: After presenting the initial design, offer to:
   - Zoom into a specific component
   - Modify relationships or structures
   - Add alternative designs
   - Export as a structured document

## Guidelines

- **Consistency**: Use the same naming conventions across all diagrams (e.g., if `User` is used in UML, use `users` in the DB table)
- **Clarity**: Keep diagrams under 60 characters wide when possible for readability in terminals
- **Completeness**: Every arrow in a diagram must have a label; every table must have a primary key
- **Progressive detail**: Start with high-level overview, then offer to drill down into specific areas
- **Ask before assuming**: If the domain is unfamiliar, ask about business rules before designing

## Examples

```
/design-with-ascii all e-commerce checkout system
/design-with-ascii prototype login and registration flow
/design-with-ascii uml order processing module
/design-with-ascii architecture microservices for a blog platform
/design-with-ascii database multi-tenant SaaS application
/design-with-ascii requirement task management tool
```
