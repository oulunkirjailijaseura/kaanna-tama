# Käännä Tämä!

![Käännä Tämä! Logo](/public/kaanna-tama.png)

## About

Käännä Tämä! (Translate This!) is a simple web application built with Next.js that allows users to translate text using a large language model (LLM). The application provides a user-friendly interface for inputting text, selecting target languages, and viewing the translated output.

## Getting Started

To run this project locally, follow these steps:

1.  Clone the repository:

    ```bash
    git clone https://github.com/oulunkirjailijaseura/kaanna-tama.git
    cd kaanna-tama
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

3.  Set up environment variables:

    Create a `.env.local` file in the root of the project and add your LLM API key:

    ```
    OPENAI_API_KEY=your-openai-api-key
    APP_PASSWORD=MyAppPassword
    ```

4.  Run the development server:

    ```bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Live Demo

[Try Käännä Tämä! live](https://kaanna-tama.vercel.app/)

## Technologies Used

*   Next.js
*   React
*   Tailwind CSS (for styling)
*   LLM (for translation - e.g., OpenAI GPT, Gemini, etc.)

## Project Structure

```
kaanna-tama/
├── public/
│   └── kaanna-tama.png
├── src/
│   ├── app/
│   │   ├── api/          # API routes for translation
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   └── ...           # Next.js app router files
├── .env.local.example
├── package.json
└── README.md
```
