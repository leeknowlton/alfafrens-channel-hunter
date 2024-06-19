# AlfaFrens Channel Hunter

Welcome to AlfaFrens Channel Hunter! This application allows you to compare subscription data between different users and see which channels are most popular among a selected group of users.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

- **Venn Frens**: Compare the subscription channels between two users, displaying common and unique subscriptions.
- **Popularity Contest**: Displays the most subscribed channels among a group of top users.
- **Responsive Design**: Mobile-friendly design ensuring a great user experience on all devices.

## Demo

Check out the live demo: [AlfaFrens Channel Hunter](https://afchannelhunter.zenigame.net)

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/leeknowlton/alfafrens-channel-hunter.git
    cd alfafrens-channel-hunter
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Add your environment variables:**

    Create a `.env.local` file in the root of your project and add your environment variables:

    ```sh
    NEYNAR_API_KEY=your-neynar-api-key
    ```

4. **Run the development server:**

    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Venn Frens

1. Navigate to the Venn Frens page.
2. Enter the usernames of two users.
3. Click "Submit" to compare their subscription channels and see common and unique subscriptions.

### Popularity Contest

1. Navigate to the Popularity Contest page.
2. View the most subscribed channels among the top users.

## Technologies Used

- **Next.js**: React framework for server-side rendering and generating static websites.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **DaisyUI**: Tailwind CSS components library.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **AlfaFrens API**: API for fetching user subscription data.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Lee Knowlton / Zenigame - [@leeknowlton.eth](https://warpcast.com/leeknowlton.eth)

Project Link: [https://github.com/leeknowlton/alfafrens-channel-hunter](https://github.com/leeknowlton/alfafrens-channel-hunter)
