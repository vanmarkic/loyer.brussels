## DO's

- solve underlying causes rather than symptoms
- detect code smell, where some code that works is actually a patch for a deeper issue
- look for root causes
- apply Test Driven Development
- always place generated \*.md files in a ./docs folder at the root of the project
- always check if an existing \*.md file can be modified instead of creating a new one for keeping track of your progress
- store the generate \*.md files in the appropriate folder (e.g. development/, analysis/, history/, ...)
- save generated \*.md files only after manual review and necessary edits
- use vitest instead of jest
- leave the codebase cleaner than you found it (boyscout rule)
- use context7 mcp server
- use "npm run test" rather than "npm test" to run tests
- removing code is a very good thing
- run playwright tests headless locally, I don't want to see the browser UI
- make sure to prefer running self terminating command in the terminal, e.g. "npx playwright test" instead of "npx playwright test --watch", look for the equivalent in other tools
- run playwright in UI mode, e.g. "npx playwright test --ui" when debugging tests
- if handy, run playwright test with vscode extension