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
- Tap **Add Filter**: `Start Date` `is today` — then change it to **yesterday** by tapping the date option
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

**7. Format Date**
- Date: `Current Date`
- Format: `Custom`
- Format string: `yyyy-MM-dd`
- Rename to `Today`

You also need yesterday's date for the payload. Add **Adjust Date** (Current Date, subtract 1 day) followed by another **Format Date** with the same `yyyy-MM-dd`, renamed `Yesterday`. Use `Yesterday` inside the JSON and `Today` in nothing, or use `Yesterday` for both the filename and the field so the file matches the data it holds. Simplest: use `Yesterday` everywhere.

**8. Text**

```
{"date":"[Yesterday]","active_energy_kcal":[Active],"steps":[Steps],"body_mass_lb":[Weight],"source":"shortcut"}
```

Each bracketed item is the renamed variable, inserted from the variable bar above the keyboard. Do not type the brackets.

**9. Base64 Encode**
- Input: the Text from step 8
- Line breaks: **None** (tap the arrow to expand options; this matters, GitHub rejects wrapped base64)

**10. Text**

```
{"message":"Health sync [Yesterday]","content":"[Base64 Encoded]"}
```

**11. Get Contents of URL**
- URL: `https://api.github.com/repos/Feirzen/bulk-manager/contents/data/health/[Yesterday].json`
- Method: **PUT**
- Headers:
  - `Authorization` = `Bearer YOUR_TOKEN_HERE`
  - `Accept` = `application/vnd.github+json`
- Request Body: **File**, and select the Text from step 10

## Test it

Run the shortcut manually. Then check `data/health/` in the repo for a new file. If nothing appears, add a **Quick Look** action after step 11 and run again. GitHub returns a readable error.

Common causes:
- `401` the token is wrong or missing `Bearer `
- `404` the repo path is misspelled, or the token has no access to this repo
- `422` the base64 has line breaks, or the file already exists for that date

## Automate it

Shortcuts app, **Automation** tab, **+**, **Time of Day**, 7:00 AM, Daily. Action: **Run Shortcut** and pick `Sync Health`. Turn **Ask Before Running** off.

Done. It runs itself from then on.
