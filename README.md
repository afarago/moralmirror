# Moral Mirror

🤔💡 I've always been fascinated by philosophical thought experiments, especially the trolley problem, which I first encountered in the show [The Good Place](https://www.imdb.com/title/tt4955642/)! It led to a long talk with my brother and inspired me to create something interactive to explore moral decision-making.

**Moral Mirror** is an interactive experiment exploring moral decision-making, inspired by the classic trolley problem. Enter your personal credo and see how an AI predicts your choices in ethical dilemmas. The app is designed to help you reflect on the gap between your stated values and your actions. 🪞

😂 As Chidi Anagonye famously said, _"That's why everyone hates moral philosophy professors."_

## What is the Trolley Problem?

A trolley is stopped at a fork in the tracks, with one person tied to each path. You must choose which track the trolley will go down, knowing that your choice will result in the death of one person. The dilemma is about making an active decision between two tragic outcomes.

## Features

- **Character Generation:** Randomly generates morally interesting characters for each scenario.
- **Credo Input:** Enter your own moral credo, which guides the AI's predictions.
- **AI Prediction:** See what the AI thinks you would do, based on your credo and the scenario.
- **Backstory Modal:** View detailed backstories for each character.
- **Shareable Scenarios:** Share specific scenarios with others using a unique seed.
- **Educational Purpose:** Designed to help users explore ethical decision-making.

## Usage

1. **Enter Your Credo:** Start by entering your personal moral credo.
2. **Generate Characters:** Click "Generate New Characters" to create a new scenario.
3. **Make Your Choice:** Select which character you would save.
4. **Ask the AI:** Click "What AI thinks you would do" to see the AI's prediction.
5. **Review and Share:** View revised credos, character backstories, and share scenarios.

## Development

This project uses [React](https://react.dev/) and [React Bootstrap](https://react-bootstrap.github.io/) for the UI. AI predictions are powered by a backend function using Groq's Llama-3 model.

💻🚀 Built with TypeScript, Vite, Bootstrap, Groq, and Netlify.  
Uses AI models: `gemma2-9b-it`, `llama-3.3-70b-versatile`, and `llama-3.1-8b-instant`.

To run locally:

```sh
yarn install
yarn dev
```

## Credits

Created by Attila Farago.  
Inspired by philosophical discussions and the TV show [The Good Place](https://www.imdb.com/title/tt4955642/).

More reflections on the trolley problem are available on [Substack](https://troypancake.substack.com/p/reflections-on-the-trolley-problem).

---

For educational purposes