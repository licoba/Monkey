# Repository Instructions

## Source Of Truth

- Edit site behavior in `sites/*.js` and shared runtime behavior in `src/*.js`.
- Treat `FusionToolBox.runtime.js` and `FusionToolBox.user.js` as generated files.
- Never hand-edit generated files. Regenerate them with `build.py`.
- Keep behavior changes covered by focused tests in `tests/`.

## Required Local Delivery Workflow

Apply this workflow after every completed user-facing userscript behavior change:

1. Run `npm test` and fix all failures.
2. Increment the patch version in `userscript-header.txt`. Use one version bump per
   completed delivery, including all corrections made before that delivery.
3. Run `python3 ./build.py` to regenerate `FusionToolBox.runtime.js` and
   `FusionToolBox.user.js`.
4. Run `python3 ./build.py --check`, `git diff --check`, and `npm test` again.
5. Verify that `FusionToolBox.user.js` contains the new version and the expected
   behavior.
6. Before committing or pushing, verify that author and committer are
   `licoba <19327381+licoba@users.noreply.github.com>` and audit all outgoing
   commits. Public commit messages must be in English and use Conventional
   Commits.
7. Commit the generated artifacts together with their source and tests.
8. Check that TCP port `8123` is free. Do not stop an unrelated process if it is
   occupied.
9. Start the temporary server with
   `python3 ./start-FusionToolBox-server.py` and keep it running.
10. Verify that
    `http://127.0.0.1:8123/FusionToolBox.user.js` returns HTTP 200, reports the
    new version, and contains the expected change.
11. Give the user this exact standalone-script installation URL:
    `http://127.0.0.1:8123/FusionToolBox.user.js`.
    Then push the tested commit to `main` and verify the Greasy Fork sync below.
12. Keep the temporary server alive until the user confirms installation, then
    stop it and verify that port `8123` is no longer listening.

The installation URL must point to `FusionToolBox.user.js`, not
`FusionToolBox.loader.user.js`. The installed standalone script must continue to
work after the temporary server stops.

Documentation-only, test-only, and repository-rule-only changes do not require a
userscript version bump or a new local installation build unless they change the
generated userscript.

## Greasy Fork Publishing

- The canonical script ID is `580054`, owned by `licoba` (user ID `227261`).
- Automatic publishing is enabled: GitHub push webhook `675575673` on
  `licoba/Monkey` updates the existing script from
  `https://raw.githubusercontent.com/licoba/Monkey/main/FusionToolBox.user.js`.
  The user authorized this workflow; a push changing this artifact on `main`
  triggers publication. Complete the local validation above before pushing.
- Verify webhook delivery and the script's sync status, version, and code after
  pushing. HTTP 200 from the webhook alone does not prove the code was synced;
  allow time for Greasy Fork's asynchronous processing. Never create a duplicate
  script if sync is delayed. Keep webhook secrets out of the repository and logs.
- For manual recovery, start from `https://greasyfork.org/zh-CN/scripts/580054-fusiontoolbox`
  and use its update/new-version link. Never use the generic
  `/script_versions/new` page, which creates a separate script.
- Verify that the update form belongs to script `580054` before submitting.
  After a login redirect, return to the canonical script page first.
- After publishing, verify the returned script ID is still `580054`, in addition
  to checking the version and content. A matching name is not sufficient.
- Verify the online version and content after publishing.
