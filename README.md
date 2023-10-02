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
<a href="https://github.com/seonwoo960000/ai-sidebar/contributors"><img src="https://img.shields.io/github/contributors/seonwoo960000/ai-sidebar.svg" /></a>
<a href="https://github.com/seonwoo960000/ai-sidebar/pulse"><img src="https://img.shields.io/github/commit-activity/m/seonwoo960000/ai-sidebar.svg?label=commits" /></a>
<a href="https://github.com/seonwoo960000/ai-sidebar/commits"><img src="https://img.shields.io/github/release-date/seonwoo960000/ai-sidebar.svg?label=release" /></a>

- Chrome extension sidebar for all sort of AI things
- Community driven, open source
- OpenAI Plugin

## Features 
![main.png](public/static/main.gif)
- Ask questions using chatGPT in chrome sidebar 

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
1. [Login to OpenAI Account](https://platform.openai.com/login)
2. [Visit OpenAI API Keys Page](https://platform.openai.com/account/api-keys)
3. Create a new API key
4. Make sure the organization is set to 'Personal'
5. Copy the API Key
6. Run `npm i` to install the necessary dependencies
7. Run `npm run build` to build source code into `./dist` 
8. Visit [chrome extensions page](chrome://extensions/)
9. Enable developer mode 
10. Load unpacked extension(select `./dist` folder)
11. Paste API Key in OpenAI API Key input box

## Note
- By providing a personal API key the user may subject to billing
- For pricing, refer to [OpenAI's pricing policy](https://openai.com/pricing)
- API key is a secret do not share it with others
- Users should understand the [rate limits](https://platform.openai.com/account/rate-limits) that the API holds
- This extension will only work within a chrome browser

## Contributions
- Submit a pull request with a clear title and description
- [Commit message best practices](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)

## Contributors 

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
