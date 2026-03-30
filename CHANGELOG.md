# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-03-29

### Added
- YouTube search with filters (upload date, duration, sort order, content type)
- Video transcript retrieval with format options, time range filtering, and segment limits
- Video metadata with brief/standard/full detail levels
- Channel info lookup by @handle, URL, or channel ID
- Channel video listing with sort options (newest, popular, oldest)
- Playlist retrieval with video details and positions
- Anonymous mode (works out of the box, no setup required)
- Personalized mode with Chrome-based cookie extraction
- Setup skill (`/youtube:setup`) for guided configuration and authentication
- YouTube research skill with tool composition guidance
- Transcript analyzer agent for structured video analysis
- Configuration CLI (`scripts/config.mjs`) for customizing default settings
- Dedicated Chrome profile for cookie extraction (isolated from user's main browser)
