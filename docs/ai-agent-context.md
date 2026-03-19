# AI Agent Context

**Service Purpose:**

The Reels app is a Gatsby 4 static site served at decentraland.org/camera-reel that provides a public viewer for in-world photos taken with the Decentraland Camera Reel feature. Users can view individual photos by ID, browse all photos taken by a specific wallet address, and share photos via URLs with Open Graph metadata for social media previews. A Cloudflare Worker (`src/_worker.ts`) intercepts requests to inject dynamic Open Graph tags before serving static assets.

**Key Capabilities:**

- Single image viewer: display a photo with metadata (scene name, photographer username, location) at `/<image_id>`
- User gallery: paginated list of all photos taken by a wallet address at `/list/<address>`
- Open Graph injection: the Cloudflare Worker dynamically rewrites `<title>` and Open Graph meta tags for individual photo URLs so they render correctly when shared on social platforms
- Camera Reel Service API client: typed REST client (`src/api/ReelService.ts`) for fetching images by ID or by wallet address
- Feature flags: runtime feature toggling via `src/modules/ff.ts`
- Segment analytics tracking
- Internationalization via `src/intl/`
- Share functionality via `src/modules/share.ts`

**Communication Pattern:**

- HTTP REST to the Camera Reel Service (`REEL_SERVICE_URL`, defaults to `https://camera-reel-service.decentraland.org`) for image metadata and listings
- Cloudflare Worker handles edge routing: intercepts `/:id` requests to attach Open Graph, falls through to static assets for everything else
- No WebSocket, no GraphQL
- Gatsby static site generation (SSG) at build time; client-side hydration for interactive gallery behavior

**Technology Stack:**

- Runtime: Node.js (compatible with Gatsby 4)
- Language: TypeScript 4.x
- Frontend Framework: Gatsby 4 + React 17
- Edge Worker: Cloudflare Worker via Wrangler 2 (`src/_worker.ts`, `@worker-tools/router`)
- API Client: `decentraland-gatsby` API utilities (`API`, `Options`, `env`)
- Styling: PostCSS with postcss-assets and postcss-svg
- Testing: Jest 29 + ts-jest
- Code Quality: ESLint + Prettier, Husky pre-commit hooks

**External Dependencies:**

- Camera Reel Service (`REEL_SERVICE_URL`): REST API for image metadata and per-wallet image listings. Endpoints: `/api/images/:id/metadata`, `/api/images` (filtered by wallet)
- Catalyst Peer (`GATSBY_CATALYST_URL`): used for resolving user profile/name data linked to wallet addresses
- Decentraland Places (`GATSBY_PLACES_URL`): used for scene/place metadata displayed alongside photos
- Marketplace (`GATSBY_MARKETPLACE_URL`): linked from image metadata UI
- Profile (`GATSBY_USER_PROFILE_URL`): linked user profile page
- The Graph (ETH + Matic subgraphs): on-chain collection lookups (`GATSBY_THE_GRAPH_API_ETH_URL`, `GATSBY_THE_GRAPH_API_MATIC_URL`)
- Segment (`GATSBY_SEGMENT_KEY`): analytics

**Key Concepts:**

- **Image / Photo**: The core domain object. Defined in `src/@types/image.ts`. Contains an `id`, `url`, and a `metadata` object with `userName`, `userAddress`, `scene` (name + coordinates), `dateTime`, and `realm`.
- **ReelService**: Singleton API client at `src/api/ReelService.ts`. Configured by `REEL_SERVICE_URL`. Key methods: `getImageById(id)`, `getImagesByWallet(address, options)`.
- **Cloudflare Worker** (`src/_worker.ts`): Acts as the edge entry point in production. Routes `/:id` to `getImageOpenGraph()` in `src/worker/image.ts` to fetch photo metadata and build OG tags, then uses `HTMLRewriter` to inject them into the static page response before returning it. Falls through to `ASSETS.fetch()` for all other paths.
- **OpenGraphWriter** (`src/worker/writer.ts`): Cloudflare `HTMLRewriter` handler that rewrites `<title>` and injects `<meta property="og:*">` tags.
- **FetchListOptions**: Query parameters for paginated wallet gallery requests, defined in `src/hooks/useImagesByUser.ts`.
- **useImageById / useImagesByUser**: Custom React hooks that drive data fetching from `ReelService` for the two main page types.
- **NotPhoto**: Fallback component shown when an image ID is invalid or not found (`src/components/NotPhoto/`).
- **`build:worker`**: The build pipeline compiles Gatsby static output first (`build:gatsby`), then publishes the Cloudflare Worker as a dry-run (`build:worker`), then generates static page routes (`build:pages` via `bin/pages.ts`).

**Out of Scope:**

- Uploading or deleting photos — handled by the Camera Reel Service backend
- In-world camera capture — handled by the Decentraland Explorer client
- User authentication and wallet connection — photos are publicly viewable without signing in
- NFT minting of photos — not part of this app
- Community or social features — handled by the Social service (social.decentraland.org)

**Project Structure:**

```
src/
  _worker.ts               # Cloudflare Worker entry point (edge routing + OG injection)
  pages/
    index.tsx              # Root page — renders NotPhoto (no direct landing)
    [image_id].tsx         # Individual photo viewer page
    list/
      [address].tsx        # Per-wallet photo gallery page
  components/
    ImageViewer/           # Main photo display with loading state
    ImageActions/          # Share/copy link actions for a photo
    Metadata/              # Scene name, date, user info display
    Loading/               # Loading skeleton
    Logo/                  # Decentraland logo
    NotPhoto/              # 404-style fallback for missing photos
  api/
    ReelService.ts         # REST client for Camera Reel Service
  hooks/
    useImageById.ts        # Fetches a single image by ID
    useImagesByUser.ts     # Fetches paginated images for a wallet
  worker/
    cloudflare.ts          # Cloudflare Worker asset fetch + OG attach helpers
    image.ts               # Builds OpenGraph options from image metadata
    writer.ts              # HTMLRewriter handler for OG tag injection
    html.ts                # HTML utility helpers
  modules/
    ff.ts                  # Feature flags
    locations.ts           # URL/path helpers
    segment.ts             # Analytics event tracking
    share.ts               # Share URL utilities
    utils.ts               # General utilities
  config/
    index.ts               # decentraland-gatsby setupEnv for dev/stg/prod
  intl/                    # i18n message files
  @types/                  # TypeScript type augmentations (image.ts, etc.)
```

**Configuration:**

Key environment variables (set per-env in `src/config/`):

| Variable | Purpose |
|---|---|
| `REEL_SERVICE_URL` / `GATSBY_REEL_SERVICE_URL` | Camera Reel Service base URL |
| `GATSBY_CATALYST_URL` | Catalyst peer for profile data |
| `GATSBY_BASE_URL` | Canonical base URL for this site |
| `GATSBY_DECENTRALAND_URL` | Decentraland Explorer URL |
| `GATSBY_PLACES_URL` | Places API base URL |
| `GATSBY_MARKETPLACE_URL` | Marketplace URL |
| `GATSBY_USER_PROFILE_URL` | Profile site URL |
| `GATSBY_SHORT_URL` | Short link domain (dcl.gg) |
| `GATSBY_THE_GRAPH_API_ETH_URL` | Ethereum subgraph URL |
| `GATSBY_THE_GRAPH_API_MATIC_URL` | Polygon subgraph URL |
| `GATSBY_SEGMENT_KEY` | Segment analytics write key |

**Testing:**

- Test runner: Jest 29 + ts-jest
- Test files co-located with source or in `src/`
- Run with `npm test`
- No dedicated test directory structure found; tests are expected alongside modules
