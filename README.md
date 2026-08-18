# Gujarat SentinelView

SENTINEL — GUJARAT POLICE CCTV INTELLIGENCE PLATFORM

Design and build a premium, production-quality, highly responsive frontend web application called:

SENTINEL

Unified Government CCTV Intelligence & Vehicle Tracking Platform

This is a frontend implementation for the Gujarat Police Innovation Hackathon 2026.

The design should feel like a serious government-grade operational intelligence platform, inspired by the visual quality, professionalism and information density of the official Sentinel Gujarat website, but DO NOT copy its layout.

The application should feel like something that could realistically be presented to police officials and government evaluators.

1. UNDERSTAND THE REAL CHALLENGE

The challenge is based on a realistic government CCTV environment.

There are:

30+ government CCTV cameras

Multiple government departments

Different CCTV infrastructure

Different vendors and systems

Live and archived footage

Approximately 12 hours of feed per camera

A proving-ground environment involving approximately 50 cameras

The core problem:

Different CCTV systems need to be brought into one intelligent platform.

Police should be able to enter a vehicle number and eventually discover:

where the vehicle appeared

which camera detected it

when it appeared

number plate

detection confidence

vehicle movement

previous/next sightings

whether it matches a watchlist

whether an alert should be generated

The platform should ultimately support a much larger deployment.

2. THE CORE USER STORY

The entire frontend should revolve around this story:

Police Officer

↓

Enters vehicle number

GJ01AB1234

↓

SENTINEL searches connected CCTV sources

↓

AI detects the vehicle

↓

ANPR reads the number plate

↓

Detection is stored

Camera + Timestamp + Location + Confidence

↓

Vehicle movement is reconstructed

↓

Watchlist is checked

↓

If matched

🚨 REAL-TIME ALERT

↓

Police sees everything on one command dashboard

This workflow should be immediately understandable to a judge.

3. PRIMARY FRONTEND PRIORITY

The FRONTEND is the main focus of this project.

Prioritize:

UI/UX

Responsive design

Vehicle search

Vehicle tracking

GIS intelligence

CCTV monitoring

Alerts

AI integration

Backend integration

Analytics

Do NOT build a generic admin panel.

Build a command-center application.

4. VISUAL IDENTITY

Use a visual identity inspired by:

Government technology

Police command center

Intelligence systems

Enterprise SaaS

GIS platforms

Mission-critical applications

Use a refined palette:

Primary

Deep Navy / Midnight Blue

Secondary

Royal Blue

Neutral

White / Off-white / Slate

Success

Green

Warning

Amber

Critical

Red

Do NOT make the entire UI black.

Do NOT use excessive neon.

Do NOT make it cyberpunk.

Do NOT use gaming aesthetics.

Do NOT overuse glassmorphism.

The interface should look serious, trustworthy and expensive.

5. TYPOGRAPHY

Use:

Manrope

for:

Main headings

Page titles

Hero text

Large KPI numbers

Weights:

700 / 800

Inter

for:

Body text

Navigation

Buttons

Tables

Data

Forms

Alerts

Metadata

Weights:

400 / 500 / 600 / 700

Typography must remain extremely readable on mobile.

6. LANDING / OVERVIEW PAGE

Create a professional landing page explaining SENTINEL.

Hero:

See Every Camera. Track Every Movement.

Subtitle:

A unified intelligence platform connecting heterogeneous government CCTV systems with AI-powered vehicle detection, tracking and real-time alerts.

Primary CTA:

Explore Command Center

Secondary CTA:

View System Architecture

Hero visual:

A sophisticated command-center preview showing:

Gujarat map

CCTV locations

vehicle route

active alert

camera feeds

detection markers

7. OFFICIAL DATASET / CHALLENGE CONTEXT

Create a section inspired by the official website's “Official Dataset” presentation.

Heading:

A Real Government CCTV Environment

Supporting text:

Designed around heterogeneous government CCTV infrastructure, multiple departments, live and archived feeds, and a realistic multi-camera proving environment.

Create three large statistics:

30+

Cameras

5

Departments

12 Hrs

Feed Per Camera

Add a fourth highlighted statistic:

~50

Camera Proving Ground

Do NOT make these look like fake marketing statistics.

Present them as challenge environment information.

8. DEPARTMENT COVERAGE

Create a clean visual section showing the participating environment.

Cards:

HEALTH

CCTV Infrastructure

POLICE

Public Safety

GSRTC

Transport

PANCHAYAT

Local Administration

MUNICIPAL

Urban Infrastructure

Show all departments feeding into:

SENTINEL

Use animated but subtle data-flow lines.

9. MAIN COMMAND CENTER

This is the MOST IMPORTANT frontend screen.

Create a high-quality dashboard.

LEFT SIDEBAR

Logo:

SENTINEL

Navigation:

Overview

Live Cameras

Vehicle Search

Vehicle Tracking

GIS Intelligence

Alerts

Watchlist

Camera Registry

Analytics

Reports

Settings

Bottom:

Police Officer profile

Status:

● System Operational

10. TOP BAR

Include:

Global Search

Current time

System health

Notifications

User profile

Example:

● 48/50 CAMERAS ONLINE

11. DASHBOARD KPI SECTION

Create six compact but premium KPI cards:

CAMERAS

50

ONLINE

48

OFFLINE

2

ACTIVE ALERTS

07

VEHICLES DETECTED

1,284

WATCHLIST MATCHES

12

Each card should have:

Icon

Large number

Label

Small contextual information

Trend where appropriate

12. LIVE CCTV WALL

Create a dedicated page:

Live Camera Intelligence

Use a responsive camera grid.

Desktop:

2x2 or 3x3 depending on screen width.

Each camera card:

CAM-029

● LIVE

Gandhinagar

10:31:22

Include:

video area

location

camera ID

department

timestamp

AI detection status

fullscreen

details

Create frontend states:

LIVE

CONNECTING

OFFLINE

NO SIGNAL

ERROR

The video container must be an integration point for the Backend/Streaming team.

Do not permanently hardcode fake video.

13. VEHICLE SEARCH

This should be one of the BEST parts of the UI.

Heading:

Search Across CCTV Network

Large input:

Enter vehicle registration number

Example:

GJ01AB1234

Button:

SEARCH VEHICLE

Add optional filters:

Date range

Department

Location

Camera

Confidence

Watchlist status

14. VEHICLE RESULT

After search, create a detailed vehicle intelligence page.

Header:

GJ01AB1234

Status:

🟢 Tracking Available

Cards:

FIRST SEEN

10:05 AM

LAST SEEN

10:47 AM

DETECTIONS

04

CAMERAS

04

LOCATIONS

02

WATCHLIST

No Match / Match

15. DETECTION TIMELINE

Create a professional vertical timeline:

10:05 AM

CAM-07

📍 Ahmedabad

Confidence: 96%

↓

10:18 AM

CAM-15

📍 Ahmedabad

Confidence: 94%

↓

10:31 AM

CAM-29

📍 Gandhinagar

Confidence: 97%

↓

10:47 AM

CAM-41

📍 Gandhinagar

Confidence: 95%

Each detection card should support:

vehicle thumbnail

plate

timestamp

camera

location

confidence

“View Camera”

“View on Map”

16. GIS INTELLIGENCE

Create a large map-based intelligence screen.

Map should display:

📍 CAM-07

↓

📍 CAM-15

↓

📍 CAM-29

↓

📍 CAM-41

Draw the vehicle route.

Use:

camera markers

vehicle markers

route lines

location labels

timestamps

map filters

Controls:

Zoom

Satellite

Cameras

Vehicle Route

Nearby Cameras

Heatmap

Fullscreen

The map must communicate information, not just decorate the page.

17. AI INTEGRATION

The AI/ML team will provide actual AI services.

Frontend must be API-ready.

Create UI states for:

AI PROCESSING

Analyzing video...

VEHICLE DETECTED

GJ01AB1234

Confidence:

94%

PLATE DETECTED

GJ01AB1234

Confidence:

97%

TRACKING

Vehicle tracked across 4 cameras

NO MATCH

Target vehicle not detected

AI results should be represented as structured data.

Do NOT fake AI capability in the final application.

Use mock data only during frontend development.

18. BACKEND INTEGRATION

The Backend team will provide APIs.

Frontend must be built around API-driven data.

Potential endpoints:

/auth
/cameras
/cameras/:id
/vehicles/:number
/vehicles/:number/history
/detections
/alerts
/watchlist
/locations
/analytics
/users


Create clean service/API layers so backend integration does not require rewriting the UI.

Frontend states:

Loading

Skeleton

Success

Actual data

Empty

No data found

Error

Unable to load data

Offline

Connection unavailable

Unauthorized

Session expired

19. REAL-TIME ALERT CENTER

Create:

Alert Intelligence

Example:

🚨 WATCHLIST MATCH

Vehicle:

GJ01AB1234

Camera:

CAM-029

Location:

Gandhinagar

Time:

10:31 AM

Confidence:

97%

Actions:

VIEW CAMERA

VIEW ROUTE

VIEW DETAILS

Alert severity:

Critical

High

Medium

Low

Resolved

20. WATCHLIST

Create:

Watchlist Intelligence

Search and filter.

Table:

Vehicle | Status | Added | Last Seen | Action

Example:

GJ01AB1234 | WATCH | Today | 10:31 | View

GJ05XY4567 | STOLEN | Yesterday | 08:22 | View

Buttons:

+ ADD TO WATCHLIST

VIEW PROFILE

21. CAMERA REGISTRY

Create:

Camera Registry

Each camera:

CAM-029

Gandhinagar

Police

🟢 Online

Stream:

Connected

AI:

Active

Last heartbeat:

2 seconds ago

Actions:

View

Health

Details

22. ANALYTICS

Create professional analytics:

Detection volume

Camera activity

Vehicle detections

Watchlist matches

Alerts over time

Camera uptime

Most active locations

AI confidence

Department activity

Use charts sparingly.

Prioritize readability.

23. MOBILE RESPONSIVENESS — EXTREMELY IMPORTANT

The website MUST be genuinely responsive.

Do NOT simply scale the desktop UI down.

Support:

320px

375px

414px

480px

Tablet

Laptop

Desktop

Large Desktop

Rules:

No horizontal overflow

No clipped text

No overlapping cards

No broken grids

No tiny text

No oversized desktop components

Touch-friendly controls

Proper spacing

Responsive typography

Responsive maps

Responsive charts

Responsive CCTV cards

24. MOBILE NAVIGATION

Desktop:

Sidebar.

Mobile:

Hamburger menu + bottom navigation.

Bottom navigation:

Home | Cameras | Search | Alerts | Profile

Keep only the most important actions.

25. MOBILE DASHBOARD

Cards should adapt:

Small phone:

1 column

Larger phone:

2 columns where appropriate

Vehicle search should occupy full width.

CCTV:

1 camera per row.

Timeline:

Vertical.

Map:

Full width.

Alerts:

Compact but clearly visible.

26. MOBILE VEHICLE SEARCH

Mobile screen:

SEARCH VEHICLE

┌───────────────────────────┐
│ GJ01AB1234                │
└───────────────────────────┘

[ SEARCH VEHICLE ]


Results:

Stacked cards.

Timeline:

Vertical.

Map:

Full width.

27. FRONTEND COMPONENT ARCHITECTURE

Create reusable components:

Sidebar

Navbar

Mobile Navigation

KPI Card

Camera Card

Alert Card

Vehicle Card

Search Bar

Timeline

Map

Table

Modal

Drawer

Status Badge

Notification

Skeleton

Empty State

Error State

Filter Panel

Keep everything modular.

28. FRONTEND + BACKEND + AI FLOW

Visually structure the project as:

FRONTEND
   ↓
BACKEND APIs
   ↓
DATABASE
   ↓
AI SERVICES
   ↓
ANPR
Vehicle Detection
Tracking
Watchlist Matching
   ↓
RESULTS
   ↓
FRONTEND


Frontend must remain independent from AI implementation.

Backend and AI teams should be able to connect through clean APIs.

29. MICRO-INTERACTIONS

Use subtle professional animations:

Page transitions

Card hover

Map marker pulse

Alert notification

Search loading

AI processing

Camera connection

Status changes

DO NOT use excessive animations.

Mission-critical UI should remain fast.

30. ACCESSIBILITY

Ensure:

High contrast

Keyboard navigation

Clear focus states

Accessible labels

Large touch targets

Color + icon for status

Readable text

Proper form labels

31. FINAL DEMO FLOW

The entire frontend should support this exact demonstration:

STEP 1

Police opens SENTINEL.

STEP 2

Dashboard shows:

50 Cameras

48 Online

STEP 3

Police searches:

GJ01AB1234

STEP 4

System displays:

4 detections found

STEP 5

Timeline shows:

CAM-07 → CAM-15 → CAM-29 → CAM-41

STEP 6

GIS shows vehicle movement.

STEP 7

System checks watchlist.

STEP 8

If matched:

🚨 WATCHLIST ALERT

STEP 9

Police clicks:

VIEW CAMERA

STEP 10

Police can inspect:

Camera + Vehicle + Location + Timestamp + Route

This should feel like a complete operational workflow.

32. MOST IMPORTANT DESIGN PRINCIPLE

The frontend should answer these five questions immediately:

WHERE?

GIS Map

WHEN?

Timeline / Timestamp

WHICH CAMERA?

Camera ID

WHICH VEHICLE?

Vehicle Number

WHAT SHOULD POLICE DO?

Alert + Action

33. FINAL DESIGN QUALITY

The final product must look:

Professional

Government-grade

Modern

Intelligent

Trustworthy

Fast

Responsive

Production-ready

It must NOT look like:

college project template

generic dashboard

gaming UI

cyberpunk interface

fake AI demo

excessive glassmorphism

over-animated landing page

FINAL BRAND STATEMENT

SENTINEL

SEE. TRACK. RESPOND.

Supporting line:

One intelligent view across Gujarat's connected CCTV ecosystem.

The FRONTEND is the primary deliverable.

Give the highest attention to:

UI/UX → RESPONSIVENESS → VEHICLE SEARCH → GIS → CCTV → ALERTS → AI INTEGRATION → BACKEND INTEGRATION.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sentinel-sight-tracker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d55a0993-9c15-4d2f-b23b-a1ba9df53bcb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
