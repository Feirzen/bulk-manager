# Apple Health to GitHub, one shortcut

Writes today's steps, active energy, resting energy and weight to `data/health/YYYY-MM-DD.json`. Runs on its own when you open apps you use anyway. No Claude, no usage.

## How it works, and why it's built this way

Two Apple limits shape everything:

1. **Health is unreadable while the phone is locked.** Apple encrypts Health data on lock, so anything that runs on a timer at night usually finds nothing and quits. That's why the old 11:55pm version only landed 4 files in six weeks. Opening an app means the phone is unlocked, so that's the trigger.
2. **The Health filter only does "today" or "last X days".** No yesterday, and no variables. So this version only ever reads **today**, and rewrites today's file every time it runs. The day's file keeps getting more complete as the day goes on. The last run before bed is the one that sticks.

Running often is fine. A guard at the top makes it skip if it ran in the last hour, so opening 40 apps a day still means about one write per waking hour, not 40. You can pick several apps for the trigger, so you don't need to guess which one you'll open.

The cost: steps after your last phone check of the night don't make it in. That's a few hundred steps, which doesn't matter for anything the system uses.

## First: the token

If your shortcut already has a working token, reuse it. Otherwise:

1. Open https://github.com/settings/personal-access-tokens/new
2. Name `bulk-health-shortcut`, Expiration 1 year
3. Repository access: **Only select repositories**, pick `bulk-manager`
4. Repository permissions: **Contents**, set to **Read and write**
5. Generate and copy it. It's only shown once

## Build it

Easiest is a fresh shortcut named **Sync Health**. Add these in order. "Rename" means long-press the action's output in a later step, or tap the action's name, and give it the name shown.

### Part 1: the once-an-hour guard

**1. Get File from Folder**
- Folder: **Shortcuts** (the iCloud Drive one)
- File path: `bulk-last-sync.txt`
- Tap the arrow, turn **Error If Not Found** off

**2. If** `File` **has any value**

  **3. Get Dates from Input**, input: `File`

  **4. Get Time Between Dates**
  - Get time between `Dates` (from step 3) and `Current Date`, in **Minutes**

  **5. If** `Time Between Dates` **is less than** `60`

    **6. Stop This Shortcut**

  **End If** (from step 5)

**End If** (from step 2)

The first time it ever runs there's no file yet, so it skips the guard and carries on.

### Part 2: read Health

**7. Find Health Samples**: `Active Energy`, Start Date **is today**, Limit off

**8. Calculate Statistics**: `Sum` of step 7. Rename `Active`

**9. Find Health Samples**: `Resting Energy`, **is today**

**10. Calculate Statistics**: `Sum`. Rename `Resting`

**11. Find Health Samples**: `Steps`, **is today**

**12. Calculate Statistics**: `Sum`. Rename `Steps`

**13. Find Health Samples**: `Body Mass`, **is today**, sort `Start Date` `Latest First`, **Limit 1**

**14. If** `Health Samples` (from 13) **has any value**
- **Get Details of Health Sample**: `Value`
- **Otherwise**: **Number** `0`
- **End If**. Rename the If Result `Weight`

A 0 means no weigh-in today. The site and reviews skip zeros, they never count as a weight.

### Part 3: dates

**15. Format Date**: `Current Date`, Custom, `yyyy-MM-dd`. Rename `Today`

**16. Format Date**: `Current Date`, **ISO 8601**, include time. Rename `Now`

### Part 4: check if today's file exists

Rewriting a file GitHub already has needs that file's ID (its "sha"). The first run of the day creates it, every later run updates it.

**17. Get Contents of URL**
- URL `https://api.github.com/repos/Feirzen/bulk-manager/contents/data/health/[Today].json`
- Method `GET`
- Headers (same three every time):

| Key | Text |
|---|---|
| `Authorization` | `Bearer github_pat_...` |
| `Accept` | `application/vnd.github+json` |
| `User-Agent` | `Shortcuts` |

**18. Get Dictionary Value**: `sha` from `Contents of URL`. Rename `Sha`

If the file doesn't exist yet, GitHub answers "Not Found" and `Sha` comes out empty. That's expected.

### Part 5: write it

**19. Text**

```
{"date":"[Today]","active_energy_kcal":[Active],"resting_energy_kcal":[Resting],"steps":[Steps],"body_mass_lb":[Weight],"synced_at":"[Now]","source":"shortcut"}
```

Insert each bracketed item from the variable bar. Don't type the brackets.

**20. Base64 Encode** the Text. Tap the arrow, **Line Breaks: None**

**21. If** `Sha` **has any value**
- **Text**: `{"message":"Health sync [Today]","content":"[Base64 Encoded]","sha":"[Sha]"}`
- **Otherwise**
- **Text**: `{"message":"Health sync [Today]","content":"[Base64 Encoded]"}`
- **End If**

**22. Get Contents of URL**
- Same URL as step 17
- Method **PUT**
- Same three headers
- Request Body **File**, choose the **If Result** from step 21

**23. Save File**
- Input: `Now`
- Tap the arrow: **Ask Where to Save** off, Destination **Shortcuts**, Subpath `bulk-last-sync.txt`, **Overwrite If File Exists** on

Step 23 is last on purpose: if the upload fails, the guard doesn't kick in and it tries again next app open.

## The automation

Shortcuts app, **Automation** tab:

1. Delete the old Time of Day automation
2. **+**, **App**, pick several apps you open daily (Messages, Safari, Instagram, Claude, whatever). Leave **Is Opened** checked
3. **Run Immediately**, and turn **Notify When Run** off
4. Choose **Sync Health**

## Test it

Run it by hand. Check `data/health/` for today's file. Run it again right away: it should stop at the guard and change nothing. To force a second write while testing, delete `bulk-last-sync.txt` from iCloud Drive's Shortcuts folder.

If no file appears, add **Quick Look** after step 22 and run again to see GitHub's answer:

- `401`: header key wrong, or the value is missing `Bearer `
- `404`: URL typo, or the token can't reach this repo
- `409` or `422` with "sha": the If in step 21 is passing the wrong text, or `Sha` came from the wrong step
- `422` "content is not valid Base64": Line Breaks isn't set to None
- "The network connection was lost": missing `User-Agent`, or the date in the URL isn't the Format Date output

Remove Quick Look once it works.
