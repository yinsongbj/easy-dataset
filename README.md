<div align="center">

![](./public//imgs/bg2.png)

<img src="https://img.shields.io/badge/version-0.1.0-blue.svg" alt="version 0.1.0"/>
<img src="https://img.shields.io/badge/license-Apache--2.0-green.svg" alt="Apache 2.0 License"/>
<img src="https://img.shields.io/badge/Next.js-14.1.0-black" alt="Next.js 14.1.0"/>
<img src="https://img.shields.io/badge/React-18.2.0-61DAFB" alt="React 18.2.0"/>
<img src="https://img.shields.io/badge/MUI-5.15.7-007FFF" alt="Material UI 5.15.7"/>

**A powerful tool for creating fine-tuning datasets for Large Language Models**

[简体中文](./README.zh-CN.md) | [English](./README.md)

[Features](#features) • [Getting Started](#getting-started) • [Usage](#usage) • [Documentation](#documentation) • [Contributing](#contributing) • [License](#license)

</div>

## Overview

Easy Dataset is a specialized application designed to streamline the creation of fine-tuning datasets for Large Language Models (LLMs). It offers an intuitive interface for uploading domain-specific files, intelligently splitting content, generating questions, and producing high-quality training data for model fine-tuning.

With Easy Dataset, you can transform your domain knowledge into structured datasets compatible with all OpenAI-format compatible LLM APIs, making the fine-tuning process accessible and efficient.

## Features

- **Intelligent Document Processing**: Upload Markdown files and automatically split them into meaningful segments
- **Smart Question Generation**: Extract relevant questions from each text segment
- **Answer Generation**: Generate comprehensive answers for each question using LLM APIs
- **Flexible Editing**: Edit questions, answers, and datasets at any stage of the process
- **Multiple Export Formats**: Export datasets in various formats (Alpaca, ShareGPT) and file types (JSON, JSONL)
- **Wide Model Support**: Compatible with all LLM APIs that follow the OpenAI format
- **User-Friendly Interface**: Intuitive UI designed for both technical and non-technical users
- **Customizable System Prompts**: Add custom system prompts to guide model responses

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ConardLi/easy-dataset.git
   cd easy-dataset
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run build

   npm run start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating a Project

1. Click the "Create Project" button on the home page
2. Enter a project name and description
3. Configure your preferred LLM API settings

### Processing Documents

1. Upload your Markdown files in the "Text Split" section
2. Review the automatically split text segments
3. Adjust the segmentation if needed

### Generating Questions

1. Navigate to the "Questions" section
2. Select text segments to generate questions from
3. Review and edit the generated questions
4. Organize questions using the tag tree

### Creating Datasets

1. Go to the "Datasets" section
2. Select questions to include in your dataset
3. Generate answers using your configured LLM
4. Review and edit the generated answers

### Exporting Datasets

1. Click the "Export" button in the Datasets section
2. Select your preferred format (Alpaca or ShareGPT)
3. Choose file format (JSON or JSONL)
4. Add custom system prompts if needed
5. Export your dataset

## Project Structure

```
easy-dataset/
├── app/                      # Next.js application directory
│   ├── api/                  # API routes
│   │   └── projects/         # Project-related APIs
│   ├── projects/             # Project-related pages
│   │   ├── [projectId]/      # Project detail pages
│   └── page.js               # Home page
├── components/               # React components
│   ├── home/                 # Home page components
│   │   ├── HeroSection.js
│   │   ├── ProjectList.js
│   │   └── StatsCard.js
│   ├── Navbar.js             # Navigation bar component
│   └── CreateProjectDialog.js
├── lib/                      # Utility libraries
│   └── db/                   # Database modules
│       ├── base.js           # Base utility functions
│       ├── projects.js       # Project management
│       ├── texts.js          # Text processing
│       ├── datasets.js       # Dataset management
│       └── index.js          # Module exports
├── styles/                   # Style files
│   └── home.js               # Home page styles
└── local-db/                 # Local database directory
```

## Documentation

For detailed documentation on all features and APIs, please visit our [Documentation Site](https://github.com/ConardLi/easy-dataset/wiki).

## Contributing

We welcome contributions from the community! If you'd like to contribute to Easy Dataset, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.


<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/ConardLi">ConardLi</a> • Follow  me：<a href="https://mp.weixin.qq.com/s/ac9XWvVsaXpSH1HH2x4TRQ">WeChat</a>｜<a href="https://space.bilibili.com/474921808">Bilibili</a>｜<a href="https://juejin.cn/user/3949101466785709">Juijin</a>｜<a href="https://www.zhihu.com/people/wen-ti-chao-ji-duo-de-xiao-qi">Zhihu</a></sub>
</div>
