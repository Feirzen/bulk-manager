# Apple Health to GitHub, one shortcut

This writes yesterday's activity straight to the repo. No Claude in the loop, no usage burned, no taps once the automation is on.

It works because each day gets its own file. Creating a new file needs no blob SHA, so there is no lookup step before the write.

## Why the old version kept failing

The first version ran at 11:55pm and read **today**. Two problems:

1. **iPhone locks Health data whenever the phone is locked.** At 11:55pm the phone is usually asleep, so the shortcut can't read anything and quits. It only worked on nights the phone happened to be in use. Result: 4 files in six weeks.
2. Running it after midnight by hand saved a brand-new, empty day (that's the 9/14 file with 0 steps).

The fix: read **yesterday**, and run when you open an app you use every morning. Opening an app means the phone is unlocked, so Health is readable every time, and yesterday is always a finished day no matter when it runs. A guard at the top stops it from running twice in one day.

## First: the token

If the shortcut already has a working token, skip this. Otherwise:

1. Open https://github.com/settings/personal-access-tokens/new
2. Name: `bulk-health-shortcut`. Expiration: 1 year
3. Repository access: **Only select repositories**, pick `bulk-manager`
4. Repository permissions: **Contents**, set to **Read and write**
5. Generate, copy it. It is shown once

## The shortcut

Name it **Sync Health**. Actions in this order. If you're editing the existing one, the new parts are steps 1 to 6 at the top, and every Health filter changes from today to yesterday.

**1. Adjust Date**
- Date: `Current Date`, **Subtract** `1` `days`

**2. Format Date**
- Date: Adjusted Date from step 1
- Date Format: `Custom`, format string `yyyy-MM-dd`
- Rename the result `Yesterday` (long-press it, Rename)

**3. Get Contents of URL** (this is the "already done today?" check)
- URL: `https://api.github.com/repos/Feirzen/bulk-manager/contents/data/health/[Yesterday].json`
- Method: `GET`
- Headers: the same three as step 16 below

**4. Get Dictionary Value**
- Get `Value` for key `sha` in Contents of URL

**5. If**
- Input: Dictionary Value, condition **has any value**

**6. Stop This Shortcut** (inside the If), then leave **Otherwise** empty, then **End If**

If yesterday's file already exists, it stops here quietly. Otherwise it carries on.

**7. Find Health Samples**
- Type: `Active Energy`
- Filter: `Start Date` `is yesterday`
- Limit off

**8. Calculate Statistics**: `Sum` of step 7. Rename `Active`

**9. Find Health Samples**: `Resting Energy`, `Start Date` `is yesterday`

**10. Calculate Statistics**: `Sum` of step 9. Rename `Resting`

**11. Find Health Samples**: `Steps`, `Start Date` `is yesterday`

**12. Calculate Statistics**: `Sum` of step 11. Rename `Steps`

**13. Find Health Samples**: `Body Mass`, `Start Date` `is yesterday`, sort `Start Date` `Latest First`, **Limit 1**

**14. Get Details of Health Sample**: `Value`. Rename `Weight`

If there's no weigh-in yesterday this comes out blank, which would break the JSON. So:

**14b. If** `Weight` **does not have any value**
- inside the If: **Number** `0`
- inside **Otherwise**: **Get Variable** `Weight`
- **End If**. Its output is the If Result. Rename it `WeightOut` and use it below. A 0 means "no reading" and is skipped everywhere.

**15. Text**

```
{"date":"[Yesterday]","active_energy_kcal":[Active],"resting_energy_kcal":[Resting],"steps":[Steps],"body_mass_lb":[WeightOut],"source":"shortcut"}
```

Each bracketed item is the variable, inserted from the bar above the keyboard. Don't type the brackets.

**15b. Base64 Encode** the Text. Tap the arrow and set **Line Breaks: None**. GitHub rejects wrapped base64

**15c. Text**

```
{"message":"Health Sync [Yesterday]","content":"[Base64 Encoded]"}
```

**16. Get Contents of URL**
- URL: same as step 3
- Method: **PUT**
- Request Body: **File**, the Text from 15c
- Headers, each a Key and a Text value:

| Key | Text |
|---|---|
| `Authorization` | `Bearer github_pat_...` |
| `Accept` | `application/vnd.github+json` |
| `User-Agent` | `Shortcuts` |

`Yesterday` in the URL must be the **Format Date** output from step 2, not a raw date. A raw date has spaces and breaks the URL.

## The automation

Shortcuts app, **Automation** tab:

1. Delete the old **Time of Day** automation
2. **+**, **App**, choose an app you open every morning (Messages, Mail, Instagram, whatever is reliable), **Is Opened**
3. **Run Immediately**, and turn **Notify When Run** off
4. Next, pick **Sync Health**

It fires every time that app opens, but steps 3 to 6 make every run after the first one stop instantly, so it writes once a day.

## Test it

Run it manually once. Check `data/health/` for yesterday's file. Run it again: nothing new should appear, because the guard stopped it. If nothing appears the first time, add **Quick Look** after step 16 and run again to see GitHub's error:

- `401`: the header key is wrong, or the value is missing `Bearer `
- `404`: path misspelled, or the token can't reach this repo
- `422`: base64 has line breaks, or the file already exists (meaning the guard isn't wired right)
- "The network connection was lost": almost always a missing `User-Agent` or spaces in the URL

Remove Quick Look once it works.
