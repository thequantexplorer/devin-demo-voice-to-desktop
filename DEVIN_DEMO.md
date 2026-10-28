# Devin demo: Voice kickoff on your phone, finish on your laptop

**What it shows:** Start a feature by voice on your phone. Devin opens a draft PR, and you pick up the same session in the web app on your laptop.

**Needs:** GitHub and a phone

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account or org as the owner, and keep the name `devin-demo-voice-to-desktop`. The links and prompt below assume that name. Use the template rather than a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.

## Prompt

Start a new Devin session and paste this. Replace `<you>` with your GitHub user or org.

```text
Hey Devin — on https://github.com/<you>/devin-demo-voice-to-desktop, add a 90-day uptime bar to each component on the status page, like the ones on GitHub's status page: green/amber/red per day computed from incident history, with a hover tooltip. Get it working and push a draft PR; I'll pick it up from my laptop to review and tweak.

When the draft PR is up, stop and summarize where you left off and exactly what's left, so I can continue this session from my laptop with full context.
```

> On your phone, open Devin, start a voice call and say the prompt. When the draft PR is up, open the same session at app.devin.ai on your laptop to review, tweak and merge. Devin Desktop and the CLI can open it too, if you use them.
