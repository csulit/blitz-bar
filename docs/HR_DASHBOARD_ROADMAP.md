# HR Dashboard Roadmap

A simple, phased approach to building an employer dashboard for the Philippine market.

**Guiding Principle:** Keep it simple and useful. No feature bloat.

---

## Phase 1: Workforce Snapshot (MVP Core)

The essentials every employer needs to see at a glance.

### Metrics

| Metric                  | Description                   | Priority |
| ----------------------- | ----------------------------- | -------- |
| Total Headcount         | Current active employees      | High     |
| New Hires               | Employees added this month    | High     |
| Separations             | Employees who left this month | High     |
| Turnover Rate           | Monthly/quarterly turnover %  | High     |
| Headcount by Department | Simple breakdown              | Medium   |

### Implementation Notes

- Single dashboard card layout
- Real-time data from employee records
- Simple month-over-month comparison

### Status

- [x] Design dashboard layout
- [x] Build headcount card
- [x] Build new hires card
- [x] Build separations card
- [x] Build turnover rate card
- [x] Add department breakdown

### Technical Notes

- Route: `src/routes/_main/dashboard.tsx`
- Components: `src/components/dashboard/`
- CASL: `Dashboard` subject with `read` permission for Employer/Agency users
- Data: Mock data (to be replaced with real DB queries)

---

## Phase 2: Government Compliance Tracker

**This is the killer feature for PH market.** Most SMEs struggle with manual tracking.

### Metrics

| Metric            | Description                       | Priority |
| ----------------- | --------------------------------- | -------- |
| SSS Status        | Contribution tracking (13% total) | High     |
| PhilHealth Status | Contribution tracking (4% total)  | High     |
| Pag-IBIG Status   | Contribution tracking             | High     |
| BIR Withholding   | Tax remittance status             | High     |
| Deadline Alerts   | Upcoming due dates                | High     |
| Compliance Score  | Simple health indicator           | Medium   |

### Implementation Notes

- Traffic light system (Green/Yellow/Red) for each agency
- Calendar view for upcoming deadlines (future iteration)
- Alert when remittance is overdue or approaching
- Monthly summary of total contributions

### Status

- [x] Design compliance dashboard
- [x] Build SSS tracking card
- [x] Build PhilHealth tracking card
- [x] Build Pag-IBIG tracking card
- [x] Build BIR tracking card
- [x] Add deadline list (calendar view planned for future)
- [x] Add compliance health indicator

### Technical Notes

- Components: `src/components/dashboard/compliance/`
- Main component: `ComplianceTracker`
- Query hook: `useComplianceStats`
- Data: Mock data (to be replaced with real DB queries)
- Traffic light colors: emerald (compliant), amber (at-risk), rose (non-compliant)

---

## Phase 3: Attendance Summary

Simple attendance visibility without complex time-tracking features.

### Metrics

| Metric          | Description                  | Priority |
| --------------- | ---------------------------- | -------- |
| Attendance Rate | % of employees present today | High     |
| Absent Today    | Count of absences            | High     |
| On Leave        | Employees on approved leave  | High     |
| Overtime Hours  | Total OT this period         | Medium   |
| Late Arrivals   | Tardiness tracking           | Low      |

### Implementation Notes

- Daily snapshot view
- Weekly/monthly summary option
- Integration with leave management

### Status

- [x] Design attendance dashboard
- [x] Build daily attendance card
- [x] Build absence tracking
- [x] Build leave status card
- [x] Add overtime summary
- [x] Add period selector (day/week/month)

### Technical Notes

- Route: `src/routes/_main/dashboard.tsx`
- Components: `src/components/dashboard/attendance/`
- Main component: `AttendanceTracker`
- Query hook: `useAttendanceStats`
- Data: Mock data (to be replaced with real DB queries)
- Period selector: Day/Week/Month tabs

---

## Phase 4: Compensation Overview

Basic payroll visibility for cost management.

### Metrics

| Metric               | Description                | Priority |
| -------------------- | -------------------------- | -------- |
| Total Payroll        | Monthly payroll cost       | High     |
| 13th Month Accrual   | Running total for year-end | High     |
| Overtime Costs       | OT expense this period     | Medium   |
| Salary by Department | Cost distribution          | Medium   |

### Implementation Notes

- Monthly summary view
- Year-to-date totals
- Simple department breakdown

### Status

- [ ] Design compensation dashboard
- [ ] Build payroll summary card
- [ ] Build 13th month tracker
- [ ] Add overtime cost tracking
- [ ] Add department breakdown

---

## Future Considerations (Post-MVP)

Features to consider after core phases are stable. **Do not build until validated.**

| Feature               | Notes                            |
| --------------------- | -------------------------------- |
| Hiring Pipeline       | Only if users request it         |
| Employee Self-Service | Leave requests, payslip view     |
| Performance Tracking  | Keep very simple if added        |
| Reports Export        | PDF/Excel for compliance reports |
| Mobile View           | Responsive dashboard             |

---

## Design Principles

1. **One glance understanding** - Metrics should be instantly clear
2. **No configuration required** - Works out of the box
3. **PH-first** - Built for Philippine labor laws and practices
4. **Actionable alerts** - Only notify when action is needed
5. **Fast loading** - Dashboard loads in under 2 seconds

---

## Success Metrics

How we know the dashboard is working:

- Employers check dashboard at least 3x per week
- Compliance deadlines are met (zero missed remittances)
- Time spent on manual tracking reduced by 50%+
- Positive feedback on simplicity

---

## Timeline Approach

No fixed dates. Ship when ready:

1. **Phase 1** → Ship when stable, gather feedback
2. **Phase 2** → Ship, this is the core value prop
3. **Phase 3** → Ship based on user demand
4. **Phase 4** → Ship if payroll integration exists

---

_Last updated: December 2024_

_Phase 1 completed: December 19, 2024_

_Phase 2 completed: December 19, 2024_

_Phase 3 completed: December 21, 2024_
