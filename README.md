# NetIQ AI Chat

[![CI/CD Status](https://github.com/iamyegor/Attire/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/iamyegor/Attire/actions/workflows/ci-cd.yaml)
[![.NET Core](https://img.shields.io/badge/.NET-Core-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack AI chat application built with ASP.NET Core and React, featuring a microservices architecture, Stripe integration, and advanced conversational capabilities.

## Key Features

*   **Conversational Branching:** Edit previous messages (user or AI) to create and navigate alternative dialogue paths, preserving the original history.
*   **AI Model Selection:** Switch between OpenAI's GPT-4o and GPT-4o mini models during a conversation.
*   **User Authentication:** Secure user registration, login, and email verification.
*   **Stripe Integration:** Functionality for managing user subscriptions.

## Tech Stack

*   **Backend:** ASP.NET Core (C#), EF Core
*   **Frontend:** React, TypeScript, React Router, React Context API
*   **Database:** PostgreSQL
*   **Infrastructure & DevOps:** Docker, Kubernetes, Helm, GitHub Actions
*   **APIs:** OpenAI API, Stripe API

## Architecture

*   **Microservices:** The backend is divided into independent Authentication and Core Chat services for scalability and separation of concerns.
*   **Design Patterns:** Both backend services implement Domain-Driven Design (DDD) and Clean Architecture principles to structure business logic and ensure maintainability.
*   **Deployment:** The application is designed to be containerized using Docker and deployed to a Kubernetes cluster managed via Helm charts. A CI/CD pipeline using GitHub Actions automates the build process.

## Conclusion

This project showcases the practical application of modern full-stack development techniques (ASP.NET Core, React), complex architectural patterns (Microservices, DDD, Clean Architecture), and DevOps practices in building a feature-rich web application.
