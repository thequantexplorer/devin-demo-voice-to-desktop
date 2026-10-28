# Devin demo: Voice kickoff on iOS, finish in Desktop or CLI

**What it shows:** Start a feature by voice in the Devin iOS app. Devin opens a draft PR, and you continue the same session in Devin Desktop or the CLI.

**Needs:** GitHub, plus the Devin iOS app and Devin Desktop or the CLI

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account or org as the owner, and keep the name `devin-demo-voice-to-desktop`. The links and prompt below assume that name. Use the template rather than a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.

## Prompt

Start a new Devin session and paste this. Replace `<you>` with your GitHub user or org.

```text
Hey Devin — on https://github.com/<you>/devin-demo-voice-to-desktop, add a 90-day uptime bar to each component on the status page, like the ones on GitHub's status page: green/amber/red per day computed from incident history, with a hover tooltip. Get it working and push a draft PR; I'll pick it up from my laptop to review and tweak.

When the draft PR is up, stop and summarize where you left off and exactly what's left, so this can be continued from Devin Desktop/CLI with full context.
```

> Say the prompt into the Devin iOS app. When the draft PR is up, open the same session in Devin Desktop or the CLI to review, tweak and merge.
