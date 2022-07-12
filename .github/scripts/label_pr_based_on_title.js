const { PR_NUMBER, PR_TITLE } = require("./constants")

module.exports = async ({github, context, core}) => {
    core.debug(PR_NUMBER);
    core.debug(PR_TITLE);

    const FEAT_REGEX = /feat(\((.+)\))?(\:.+)/
    const BUG_REGEX = /(fix|bug)(\((.+)\))?(\:.+)/
    const DOCS_REGEX = /(docs|doc)(\((.+)\))?(\:.+)/
    const CHORE_REGEX = /(chore)(\((.+)\))?(\:.+)/
    const DEPRECATED_REGEX = /(deprecated)(\((.+)\))?(\:.+)/
    const REFACTOR_REGEX = /(refactor)(\((.+)\))?(\:.+)/

    const labels = {
        "feature": FEAT_REGEX,
        "bug": BUG_REGEX,
        "documentation": DOCS_REGEX,
        "internal": CHORE_REGEX,
        "enhancement": REFACTOR_REGEX,
        "deprecated": DEPRECATED_REGEX,
    }

    // Maintenance: We should keep track of modified PRs in case their titles change
    for (const label in labels) {
        const matcher = new RegExp(labels[label])
        const isMatch = matcher.exec(PR_TITLE)
        if (isMatch != null) {
            core.info(`Auto-labeling PR ${PR_NUMBER} with ${label}`)

            await github.rest.issues.addLabels({
            issue_number: PR_NUMBER,
            owner: context.repo.owner,
            repo: context.repo.repo,
            labels: [label]
            })

            break
        }
    }

    return core.notice(`PR ${PR_NUMBER} title '${PR_TITLE}' doesn't follow semantic titles; skipping...`)
}