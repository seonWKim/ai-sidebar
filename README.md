<p>
    <img src="public/static/image/favicon-64x64.png" alt="ai-sidebar logo" />
</p>

🤩 [Download Chrome Extension](https://chromewebstore.google.com/detail/free-ai-side-bar/bphjdepgpbodffelhponjdfpjdajghgc)

<p>
    <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue3" height="20"/>
    <img src="https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square" alt="Typescript" height="20"/>
</p>

# AI Side Bar

<a href="https://github.com/seonwoo960000/ai-sidebar"><img src="https://img.shields.io/github/stars/seonwoo960000/ai-sidebar.svg?style=social" /></a>
<a href="https://github.com/seonwoo960000/ai-sidebar/pulse"><img src="https://img.shields.io/github/commit-activity/m/seonwoo960000/ai-sidebar.svg?label=commits" /></a>
<a href="https://github.com/seonwoo960000/ai-sidebar/commits"><img src="https://img.shields.io/github/release-date/seonwoo960000/ai-sidebar.svg?label=release" /></a>

- Chrome extension sidebar for all sort of AI things
- Community driven and open source

## Features

![main.png](main.png)

- Ask questions using chatGPT in chrome sidebar
  - Message Template
  - Memorize Context

## Requirements

- Node v16>=

## Commands

- `npm i`: Install dependencies
- `npm run dev`: Start dev server
- `npm run build`: Build the source code into './dist'
- `npm run build-watch`: Build the source code into `./dist` and continuously rebuild when changes occur
- `npm run test`: Run tests below `./src/tests` directory

## Build and Test Chrome Extension 👨‍💻

![instruction.png](images/instruction.png)

1. Run `npm i` to install the necessary dependencies
2. Run `npm run build` to build source code into `./dist`
3. Visit [chrome extensions page](chrome://extensions/)
4. Enable developer mode
5. Load unpacked extension(select `./dist` folder)
6. Paste API Key in OpenAI API Key input box(Set `VITE_MOCK_OPENAI_API` to `true` in `.env` file to mock OpenAI API)

## Note

- By providing a personal API key the user may subject to billing
- API key is a secret. <b>DO NOT</b> share it with others
- Users should understand the [rate limits](https://platform.openai.com/account/rate-limits) that the API holds
- This extension will only work within a chrome browser

## Contributions

- Submit an issue for any features or bug
- Submit a pull request with a clear title and description
- Run `npm run pull-request-check` before submitting a pull request
- [Commit message best practices](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)

## Contributors

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/seonwoo960000"><img src="https://avatars.githubusercontent.com/u/69591622?v=4?s=100" width="100px;" alt="Kim Seon Woo"/><br /><sub><b>Kim Seon Woo</b></sub></a><br /><a href="https://github.com/seonwoo960000/ai-sidebar/commits?author=seonwoo960000" title="Code">💻</a> <a href="https://github.com/seonwoo960000/ai-sidebar/commits?author=seonwoo960000" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/rhythm-sharma-708a421a8/"><img src="https://avatars.githubusercontent.com/u/64489317?v=4?s=100" width="100px;" alt="Rhythm Sharma"/><br /><sub><b>Rhythm Sharma</b></sub></a><br /><a href="#design-Rhythm-08" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/CainanConway"><img src="https://avatars.githubusercontent.com/u/37641258?v=4?s=100" width="100px;" alt="CainanConway"/><br /><sub><b>CainanConway</b></sub></a><br /><a href="https://github.com/seonwoo960000/ai-sidebar/commits?author=CainanConway" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/aishwarya-mali"><img src="https://avatars.githubusercontent.com/u/43086476?v=4?s=100" width="100px;" alt="Aishwarya Mali"/><br /><sub><b>Aishwarya Mali</b></sub></a><br /><a href="#design-aishwarya-mali" title="Design">🎨</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
