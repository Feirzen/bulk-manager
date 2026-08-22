# Apple Health to GitHub, one shortcut

This writes yesterday's activity straight to the repo. No Claude in the loop, no usage burned, no taps once the automation is on.

It works because each day gets its own file. Creating a new file needs no blob SHA, so there is no lookup step and no failure mode where the write is rejected for being out of date.

## First: make the token

1. github.com, click your avatar, **Settings**
2. Bottom left, **Developer settings**
3. **Personal access tokens** then **Fine-grained tokens**
4. **Generate new token**
   - Name: `bulk-health-shortcut`
   - Expiration: 1 year
   - Repository access: **Only select repositories** then pick `bulk-manager`
   - Permissions, Repository permissions: find **Contents** and set it to **Read and write**
5. Generate, then copy the token. It is shown once.

This token can touch one repo and nothing else. If it ever leaks, revoke it from that same page.

## Then: build the shortcut

New shortcut, name it **Sync Health**. Add these in order.

**1. Find Health Samples**
- Type: `Active Energy`
- Sort by: `Start Date`, Order: `Latest First`
- Tap **Add Filter**: `Start Date` `is today`, then change it to **yesterday**
- Turn **Limit** off

**2. Calculate Statistics**
- Operation: `Sum`
- Input: `Health Samples` from step 1
- Rename the result: long-press the variable, **Rename**, call it `Active`

**3. Find Health Samples**
- Type: `Steps`
- Same yesterday filter

**4. Calculate Statistics**
- `Sum` of step 3. Rename to `Steps`

**5. Find Health Samples**
- Type: `Body Mass`
- Sort: `Start Date`, `Latest First`, **Limit: 1 item**

**6. Get Details of Health Sample**
- Detail: `Value`
- Rename to `Weight`

**7. Adjust Date**
- Date: `Current Date`, subtract `1` day

**8. Format Date**
- Date: the Adjusted Date from step 7
- Format: `Custom`
- Format string: `yyyy-MM-dd`
- Rename to `Yesterday`

Use `Yesterday` for both the filename and the date field, so the file always matches the data inside it.

**9. Text**

```
{"date":"[Yesterday]","active_energy_kcal":[Active],"steps":[Steps],"body_mass_lb":[Weight],"source":"shortcut"}
```

Each bracketed item is the renamed variable, inserted from the variable bar above the keyboard. Do not type the brackets.

**10. Base64 Encode**
- Input: the Text from step 9
- Line breaks: **None** (tap the arrow to expand options; GitHub rejects wrapped base64)

**11. Text**

```
{"message":"Health sync [Yesterday]","content":"[Base64 Encoded]"}
```

**12. Get Contents of URL**
- URL: `https://api.github.com/repos/Feirzen/bulk-manager/contents/data/health/[Yesterday].json`

  The `[Yesterday]` chip must be the **Format Date output** from step 8, not Current Date. A raw date resolves to something like `August 22, 2026 at 5:26 PM`, and the spaces break the URL.
- Method: **PUT**
- Request Body: **File**, and select the Text from step 11

Headers. Each is a **Key** and a **Text** value, and the split matters. The word `Bearer` belongs in the value, not the key.

| Key | Text |
|---|---|
| `Authorization` | `Bearer github_pat_...` |
| `Accept` | `application/vnd.github+json` |
| `User-Agent` | `Shortcuts` |

One space between `Bearer` and the token. GitHub's API rejects requests with no User-Agent and Shortcuts does not reliably send one, so that third header is required rather than optional.

## Test it

Run the shortcut manually, then check `data/health/` in the repo for a new file. If nothing appears, add a **Quick Look** action after step 12 and run again. GitHub returns a readable error instead of leaving Shortcuts to guess.

Common causes:

- **"The network connection was lost"** usually is not the network. It is a malformed request: a missing `User-Agent`, or spaces in the URL from an unformatted date variable
- `401` the header key is `Bearer` instead of `Authorization`, or the value is missing the `Bearer ` prefix
- `404` the path is misspelled, or the token cannot reach this repo. GitHub returns 404 rather than 403 for unauthorized writes, so a 404 often means an auth problem and not a typo
- `422` the base64 has line breaks, or a file already exists for that date

A successful response contains the file path and a commit SHA. Remove Quick Look once you see it.

## Automate it

Shortcuts app, **Automation** tab, **+**, **Time of Day**, 7:00 AM, Daily. Action: **Run Shortcut**, pick `Sync Health`. Turn **Ask Before Running** off.

Done. It runs itself from then on.
