# Decentraland Camera Reel

[![Coverage Status](https://coveralls.io/repos/github/decentraland/reels/badge.svg?branch=main)](https://coveralls.io/github/decentraland/reels?branch=main)

A Gatsby-based UI for browsing and viewing in-game screenshots (camera reels) captured by Decentraland players at decentraland.org/camera-reel. Allows viewing individual images and browsing a list of public reels.

## Table of Contents

- [Features](#features)
- [Dependencies & Related Services](#dependencies--related-services)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [AI Agent Context](#ai-agent-context)

## Features

- **Reel Index**: Landing page for the camera reel gallery
- **Individual Image View**: Full-page view for a single reel image (`/[image_id]`)
- **Image List**: Browse multiple reel images (`/list`)
- **Share Support**: Social sharing metadata for individual images

## Dependencies & Related Services

- **Camera Reel Service** ([github.com/decentraland/camera-reel-service](https://github.com/decentraland/camera-reel-service)): source of all reel image data and metadata
- **Catalyst / Peer API**: avatar and profile data shown alongside images

### What This UI Does NOT Handle

- Taking screenshots (in-game feature, not part of this UI)
- Reel storage and processing (camera-reel-service)
- Profile management (profile site)

## Getting Started

### Prerequisites

- npm

### Installation

```bash
npm install
```

### Configuration

Create a copy of `.env.example` and name it `.env.development`:

```bash
cp .env.example .env.development
```

### Running the UI

```bash
npm start
```

## Testing

### Running Tests

```bash
npm test
```

### Test Structure

Test files follow the Gatsby test setup conventions.

## AI Agent Context

For detailed AI Agent context, see [docs/ai-agent-context.md](docs/ai-agent-context.md).

---
