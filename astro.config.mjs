// @ts-check
import { defineConfig } from 'astro/config';

// On GitHub, the deploy workflow sets GITHUB_REPOSITORY to "owner/repo-name".
// A repo named "<username>.github.io" is served from the root of that address;
// any other name is served from "/repo-name/". Locally neither applies.
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserSite = !repo || repo.toLowerCase().endsWith('.github.io');

export default defineConfig({
  site: owner ? `https://${owner.toLowerCase()}.github.io` : undefined,
  base: isUserSite ? '/' : `/${repo}`,
});
