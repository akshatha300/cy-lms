# Role-Based Cybersecurity Learning Paths with Job Readiness Scoring
## Integration Plan & Design Document

---

## 1. EXECUTIVE SUMMARY

This feature adds **job-role mapping** on top of your existing LMS without breaking current functionality. Users can:
- Select a security role (SOC Analyst, Penetration Tester, Cloud Engineer, etc.)
- Follow a curated learning path tailored to that role
- Track completion of skills required for the role
- See their "Job Readiness Score" (0-100%)

**Key design principle:** All new entities are optional overlays on existing LMS. Users can continue using the old module-based learning if roles aren't selected.

---

## 2. ANALYSIS OF EXISTING STRUCTURE

### Current State
| Entity | Purpose | Scope |
|--------|---------|-------|
| User | Authentication, role (user/admin) | System-wide |
| Module | Course unit with difficulty & tags | Grouped questions |
| Progress | User-wide stats (accuracy, streak) | Single record per user |
| Attempt | Individual question answer tracking | Granular per-question |
| Question | MCQ within a module | Module-scoped |

### Integration Points
- **No breaking changes**: All existing endpoints continue working
- **User role** will be extended (not replaced) with optional `securityRole` field
- **Modules** now map to Skills (new concept)
- **Attempts** now contribute to skill progress (new layer)

---

## 3. NEW DATA MODEL (Database Schema)

### 3.1 SecurityRole
```javascript
{
  _id: ObjectId,
  name: String,              // "SOC Analyst L1"
  description: String,       // "Monitor logs, detect threats"
  seniority: String,         // "entry", "mid", "senior"
  requiredSkills: [ObjectId], // FK to Skill[]
  requiredLabCount: Number,  // e.g., 3 labs must be passed
  estimatedHoursToComplete: Number,
  tags: [String],            // "soc", "network", "detection"
  createdAt, updatedAt
}
```

### 3.2 Skill
```javascript
{
  _id: ObjectId,
  name: String,              // "Log Analysis"
  description: String,       // What this skill covers
  difficulty: Number,        // 1-5, inherited from linked modules
  requiredModules: [ObjectId], // FK to Module[]
  requiredLabCount: Number,  // # of labs user must pass
  assessmentType: String,    // "quiz", "lab", "both"
  tags: [String],            // "logging", "analysis"
  estimatedHours: Number,
  createdAt, updatedAt
}
```

### 3.3 SkillProgress
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // FK to User
  skillId: ObjectId,         // FK to Skill
  roleId: ObjectId,          // FK to SecurityRole (optional, for context)
  
  // Completion tracking
  modulesCompleted: Number,  // e.g., 2 of 3
  requiredModules: [ObjectId], // Which modules required
  completedModules: [ObjectId], // Which ones user completed
  
  // Lab tracking
  labsCompleted: Number,
  labsPassed: Number,
  labAttempts: [ObjectId],   // FK to LabAttempt[]
  
  // Quiz/Assessment
  quizAttempts: Number,
  bestQuizScore: Number,     // 0-100
  lastQuizDate: Date,
  
  // Overall
  completionPercentage: Number, // 0-100
  status: String,            // "not-started", "in-progress", "completed"
  lastActivityAt: Date,
  createdAt, updatedAt
}
```

### 3.4 Lab (Abstracted schema for attack/defense exercises)
```javascript
{
  _id: ObjectId,
  name: String,              // "Brute Force Detection Lab"
  description: String,
  skillId: ObjectId,         // FK to Skill
  difficulty: Number,        // 1-5
  scenario: String,          // "attack" | "defense" | "both"
  objectiveText: String,     // What user needs to do
  
  // For future implementation
  environment: String,       // "docker", "vm", "cloud" (optional)
  timeLimit: Number,         // in minutes
  
  tags: [String],
  createdAt, updatedAt
}
```

### 3.5 LabAttempt
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // FK to User
  labId: ObjectId,           // FK to Lab
  skillId: ObjectId,         // FK to Skill
  roleId: ObjectId,          // FK to SecurityRole
  
  // Result tracking
  status: String,            // "success" | "partial" | "failed"
  score: Number,             // 0-100
  timeTakenSeconds: Number,
  
  // For future expansion
  evidenceSubmitted: String, // JSON/text proof of completion
  mentorFeedback: String,
  
  completedAt: Date,
  createdAt
}
```

### 3.6 JobReadinessScore (Summary view)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // FK to User
  roleId: ObjectId,          // FK to SecurityRole
  
  // Component scores
  skillsCompletionPercent: Number,    // avg of all skill completion %
  labSuccessRate: Number,             // passed labs / required labs * 100
  assessmentScore: Number,            // avg quiz/assessment scores
  
  // Overall job readiness
  overallReadinessScore: Number,      // 0-100
  readinessLevel: String,             // "not-ready" | "basic" | "ready" | "advanced"
  missingSkills: [ObjectId],          // FK to Skill[]
  estimatedWeeksToReady: Number,      // based on activity pace
  
  lastCalculatedAt: Date,
  createdAt, updatedAt
}
```

### 3.7 User Schema Extension
```javascript
// Existing User schema + optional field:
{
  // ... existing fields ...
  selectedRoles: [ObjectId],  // FK to SecurityRole[] (for future multi-role)
  primaryRole: ObjectId,      // FK to SecurityRole (optional)
  preferredCareerPath: String, // "soc", "pentest", "cloud", etc.
  // ... timestamps ...
}
```

---

## 4. RELATIONSHIP DIAGRAM

```
┌─────────────────────────────────────────────────┐
│ User (existing)                                  │
│ - role: "user" | "admin"  (unchanged)           │
│ + primaryRole: SecurityRole (NEW)               │
│ + selectedRoles: [SecurityRole] (NEW)           │
└────┬────────────────────────────────────────────┘
     │ has many
     ├──────────────────┬──────────────────┬──────────────────┐
     │                  │                  │                  │
     v                  v                  v                  v
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Progress     │ │ Attempt      │ │ SkillProg    │ │ LabAttempt   │
│ (existing)   │ │ (existing)   │ │ (NEW)        │ │ (NEW)        │
│ unchanged    │ │ unchanged    │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
                        │                │                │
                        └────────────────┼────────────────┘
                                         v
                        ┌──────────────────────────┐
                        │ Skill (NEW)              │
                        │ - name, difficulty      │
                        │ - requiredModules[]     │
                        │ - requiredLabCount      │
                        └────┬────────────────────┘
                             │ mapped by
                             v
                        ┌──────────────────────────┐
                        │ Module (existing)        │
                        │ unchanged                │
                        └──────────────────────────┘

                        ┌──────────────────────────┐
                        │ Lab (NEW - abstracted)   │
                        │ - name, scenario         │
                        │ - skillId FK             │
                        └──────────────────────────┘
                             │ belongs to
                             │
┌────────────────────────────┴──────────────────────┐
│ SecurityRole (NEW)                               │
│ - name: "SOC Analyst L1"                        │
│ - requiredSkills: [Skill]                       │
│ - requiredLabCount                              │
└────────────────────────────────────────────────┘
     │ mapped to
     v
┌──────────────────────────────┐
│ JobReadinessScore (NEW)      │
│ - overallReadinessScore 0-100│
│ - missingSkills              │
│ - readinessLevel             │
└──────────────────────────────┘
```

---

## 5. DATABASE MIGRATION STRATEGY

### Phase 1: Safe Addition (No Data Loss)
1. Create new collections: `securityroles`, `skills`, `skillprogresses`, `labs`, `labattempts`, `jobreadinessscores`
2. Add optional fields to User: `primaryRole`, `selectedRoles`
3. Existing Progress & Attempt records remain unchanged
4. **No breaking changes**: Old LMS still fully functional

### Phase 2: Populate Master Data
1. Create pre-defined SecurityRoles (SOC Analyst, Pentest, Cloud Engineer, etc.)
2. Map existing Modules to Skills
3. Seed sample Labs (abstracted, not fully functional yet)

### Phase 3: Gradual User Onboarding
1. Add role-selection UI to user dashboard (optional)
2. When user selects role:
   - Create initial SkillProgress records for all skills in that role
   - Generate JobReadinessScore baseline (0%)
3. As user completes attempts → update SkillProgress → recalculate JobReadinessScore

### Phase 4: Backward Compatibility
- Users without roles still use old module-based learning
- Existing progress/attempts feed into role-based progress if role is selected
- Can enable role-switching anytime

---

## 6. API ENDPOINTS

### Role Management
```
POST   /api/roles/
       Body: { name, description, requiredSkills: [skillId], requiredLabCount }
       Response: { _id, name, ... }

GET    /api/roles/
       Response: [ { _id, name, description, requiredSkills, ... }, ... ]

GET    /api/roles/:roleId
       Response: { _id, name, description, skills: [{...}], estimatedHours }
```

### Skill Management
```
POST   /api/skills/
       Body: { name, description, requiredModules: [moduleId], requiredLabCount }
       Response: { _id, name, ... }

GET    /api/skills/
       Response: [ {...}, ... ]

GET    /api/skills/:skillId
       Response: { _id, name, requiredModules: [{title, ...}], ... }
```

### User Role Selection
```
POST   /api/users/me/role
       Body: { roleId }
       Response: { message, user: { _id, primaryRole, selectedRoles, ... } }

GET    /api/users/me/role
       Response: { primaryRole, selectedRoles, ... }
```

### Skill Progress
```
GET    /api/roles/:roleId/progress
       Requires: auth
       Response: {
         roleId, userId,
         skills: [
           { skillId, name, completionPercent, status, labsCompleted },
           ...
         ],
         overallCompletion: 75
       }

GET    /api/skills/:skillId/progress
       Response: {
         skillId, userId, completionPercent, modulesCompleted,
         labsCompleted, bestQuizScore, lastActivityAt
       }
```

### Job Readiness Score
```
GET    /api/users/me/job-readiness
       Response: {
         roleId, userId,
         overallReadinessScore: 62,
         readinessLevel: "in-progress",
         skillsCompletion: [
           { skillId, name, percent: 80, status: "completed" },
           { skillId, name, percent: 40, status: "in-progress" },
           ...
         ],
         missingSkills: [
           { skillId, name, estimatedHours: 6 },
           ...
         ],
         estimatedWeeksToReady: 4
       }

GET    /api/users/me/job-readiness/timeline
       Response: {
         pastScores: [ { date, score }, ... ],
         trend: "improving" | "stable" | "declining"
       }
```

### Lab Integration
```
GET    /api/skills/:skillId/labs
       Response: [ { _id, name, scenario, difficulty, ... }, ... ]

POST   /api/labs/:labId/attempt
       Body: { status, score, evidenceSubmitted }
       Response: { _id, labId, userId, status, score, ... }

GET    /api/labs/:labId/attempts
       Response: [ {...}, ... ]
```

---

## 7. BACKEND SERVICE LAYER

### `roleService.js`
```javascript
- getRoles() → [SecurityRole]
- getRoleById(roleId) → SecurityRole
- createRole(data) → SecurityRole
- getRoleWithSkills(roleId) → { role, skills: [{...}] }
```

### `skillService.js`
```javascript
- getSkills() → [Skill]
- getSkillById(skillId) → Skill
- createSkill(data) → Skill
- linkModuleToSkill(skillId, moduleId) → Skill
- getSkillRequirements(skillId) → { modules, labCount, ... }
```

### `skillProgressService.js`
```javascript
- initializeSkillProgressForRole(userId, roleId) → [SkillProgress]
- getSkillProgress(userId, skillId) → SkillProgress
- updateSkillProgress(userId, skillId, updates) → SkillProgress
- calculateSkillCompletion(skillId, userId) → 0-100
- getSkillProgressForRole(userId, roleId) → [SkillProgress]
```

### `jobReadinessService.js`
```javascript
- calculateJobReadiness(userId, roleId) → JobReadinessScore
  - Computes: skills % + labs % + assessments %
  - Weighted average
  - Generates missing skills list
  - Estimates weeks to completion
  
- getJobReadinessScore(userId, roleId) → JobReadinessScore
- updateJobReadinessScore(userId, roleId) → JobReadinessScore (force recalc)
- getReadinessTimeline(userId, roleId, days=90) → [{date, score}, ...]
```

### `labService.js`
```javascript
- getLabs() → [Lab]
- getLabsBySkill(skillId) → [Lab]
- createLabAttempt(userId, labId, data) → LabAttempt
- getLabAttempts(userId, labId) → [LabAttempt]
- updateLabAttempt(attemptId, result) → LabAttempt
```

---

## 8. CONTROLLER LAYER (Endpoints)

### `roleController.js`
```javascript
export const selectUserRole = async (req, res) => {
  const userId = req.user._id;
  const { roleId } = req.body;
  
  // Validate role exists
  const role = await SecurityRole.findById(roleId);
  if (!role) return res.status(404).json({ error: "Role not found" });
  
  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    { primaryRole: roleId },
    { new: true }
  );
  
  // Initialize skill progress
  await initializeSkillProgressForRole(userId, roleId);
  
  // Create initial job readiness score
  const readiness = await calculateJobReadiness(userId, roleId);
  
  res.json({ message: "Role selected", user, readiness });
};
```

### `skillProgressController.js`
```javascript
export const getUserRoleProgress = async (req, res) => {
  const userId = req.user._id;
  const { roleId } = req.params;
  
  // Fetch all skill progress for this role
  const skillProgress = await getSkillProgressForRole(userId, roleId);
  
  // Calculate aggregates
  const totalSkills = skillProgress.length;
  const completedSkills = skillProgress.filter(sp => sp.status === 'completed').length;
  
  res.json({
    roleId,
    userId,
    skills: skillProgress,
    overallCompletion: (completedSkills / totalSkills) * 100
  });
};
```

### `jobReadinessController.js`
```javascript
export const getUserJobReadiness = async (req, res) => {
  const userId = req.user._id;
  const { roleId } = req.query;
  
  if (!roleId) {
    return res.status(400).json({ error: "roleId is required" });
  }
  
  const readiness = await calculateJobReadiness(userId, roleId);
  
  res.json(readiness);
};
```

---

## 9. FRONTEND COMPONENT STRUCTURE

### Components to Add

#### `RoleSelector.jsx`
```jsx
// User selects their security role
- Display list of SecurityRoles
- Each role card shows: name, description, estimatedHours, requiredSkills count
- onClick → POST /api/users/me/role → redirect to RoleDashboard
```

#### `RoleDashboard.jsx`
```jsx
// Main view for role-based learner
- Header: Role name + Overall readiness score (big number)
- ReadinessMetrics component
  - Skill completion %
  - Labs passed %
  - Assessment score %
- SkillProgressList component
  - List all skills for this role
  - Each skill: name, % complete, required modules, labs
- MissingSkillsAlert component
  - Show what's blocking progress
```

#### `SkillProgressCard.jsx`
```jsx
// Reusable card for skill status
Props: skill, progress
- Skill name + difficulty
- Progress bar (% complete)
- Modules: [✓ Phishing Basics] [○ Advanced Phishing]
- Labs: [✓ Pass] [✓ Pass] [○ Pending]
- onClick → navigate to /role/:roleId/skills/:skillId
```

#### `SkillDetailView.jsx`
```jsx
// Deep dive into one skill
- Skill info + learning path
- Required modules list + completion status
- Required labs list + attempt history
- Assess button (trigger quiz)
- Lab attempt button
```

#### `JobReadinessDashboard.jsx`
```jsx
// Dedicated readiness view
- Big readiness score + gauge
- Component breakdown (skills % + labs % + assessments %)
- Progress over time (chart)
- Recommended next steps
```

#### `LabAttemptForm.jsx`
```jsx
// Submit lab attempt (abstracted)
- Lab scenario display
- Input for evidence/proof
- Submit → POST /api/labs/:labId/attempt
- Show result: pass/fail + feedback
```

---

## 10. INTEGRATION WITH EXISTING LMS

### How Attempts Feed Into Skills

```
Workflow:
1. User selects role → initialized SkillProgress
2. User takes quiz in module → Attempt created (existing logic)
3. NEW: After attempt, check if question tags match skill requirements
4. NEW: Update SkillProgress for matching skills
5. NEW: Recalculate JobReadinessScore
```

### Backward Compatibility Checklist
- ✅ All existing endpoints remain unchanged
- ✅ Attempts still update Progress (existing model)
- ✅ Modules still function standalone
- ✅ Users without roles see nothing new
- ✅ Old progress data untouched

---

## 11. IMPLEMENTATION ROADMAP (Phased)

### Phase 1: Data Models (Week 1)
- [ ] Create all 7 new schemas
- [ ] Migrate database
- [ ] Create seeding script for roles & skills

### Phase 2: Core Services (Week 2)
- [ ] roleService
- [ ] skillService
- [ ] skillProgressService (basic)

### Phase 3: Job Readiness (Week 2-3)
- [ ] jobReadinessService
- [ ] labService (abstracted)
- [ ] Calculation logic

### Phase 4: Backend APIs (Week 3)
- [ ] Role endpoints
- [ ] Skill endpoints
- [ ] Job readiness endpoints
- [ ] Skill progress endpoints

### Phase 5: Frontend (Week 4)
- [ ] RoleSelector component
- [ ] RoleDashboard component
- [ ] SkillProgressCard + list
- [ ] JobReadiness view

### Phase 6: Polish & Testing (Week 5)
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Documentation

---

## 12. DEPLOYMENT CONSIDERATIONS

### Before Launch
1. **Backup existing database** (Attempt, Progress, Module, User)
2. **Test new schema migrations** on staging
3. **Validate backward compatibility** with existing users
4. **Load test** job readiness calculations

### Launch Strategy
1. Deploy new collections + APIs (non-breaking)
2. Deploy frontend components (hidden behind feature flag initially)
3. Enable for 10% of users (beta)
4. Monitor for errors
5. Full rollout

### Rollback Plan
- All new collections are isolated
- Simply disable API routes if needed
- Existing LMS continues to work unaffected

---

## 13. RESUME & INTERVIEW POINTS

**What to emphasize:**

✅ **Architecture**: "Designed multi-layer skill mapping system without breaking existing LMS"

✅ **Data modeling**: "Carefully mapped job roles → skills → existing modules + new labs"

✅ **Scalability**: "Job readiness calculated via aggregation pipeline (can handle 10k+ users)"

✅ **Backward compatibility**: "Phased rollout with feature flagging ensures zero downtime"

✅ **User-centric**: "Gamified readiness score drives engagement + career progression"

---

## Next Steps

Ready to proceed? I'll implement in order:
1. Create all schemas
2. Build services layer
3. Create controllers & routes
4. Design frontend components
5. Create seeding scripts
6. Integration testing guide

Let me know which phase to start with! 🚀
