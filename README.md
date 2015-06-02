## Git Release Note

if you are using github and git flow for your project, you can use this code to generate the release note.

### Installation

npm install git-release-note -g

### Usage

inside your repo just run the following command and the tool, generate the release note

```bash
gen-release-note
```

### Suggestion

for the tool to work well, you have to follow git flow.

for any feature and bug fixes use

```bash
git flow feature start #<issue number>

...implement or fix the code

git flow feature finish #<issue number>
```

once you close bunch of issues make a release

```bash
git flow release start v1.0.0
git flow release finish v1.0.0
```

Once that one is done, just run the git-release-note to generate your release note from commits that git flow produces.

NOTE: make sure that you are in a master branch before running git-release-note command.
