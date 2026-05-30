<!-- Add banner here -->

<img width="1918" height="859" alt="image" src="https://github.com/user-attachments/assets/5ec8304e-0e4c-4125-ada2-34b365b5bdc6" />




# ecommercewebsite.me

<!-- Describe your project in brief -->

<!-- [![deploy-manifests](https://github.com/ecommerce/microservices-ecommerce/actions/workflows/deploy-manifests.yaml/badge.svg)](https://github.com/ecommerce/microservices-ecommerce/actions/workflows/deploy-manifests.yaml) -->

ecommercewebsite.me is a women's clothing e-commerce website that features a fully operational **microservices architecture**. Built on the **Next.js** framework for the client-side, while the server-side is developed with **TypeScript and Express** framework, this deployment uses **Azure DevOps** pipelines to provision Azure resources and deploy to **Azure Kubernetes Service (AKS)** with **Terraform** as IaC. Terraform reference repo: https://github.com/Sonaligup-creator/Terraform-Infra.

Refer Architecture Diagram
<img width="1600" height="643" alt="Architecture-diagram" src="https://github.com/user-attachments/assets/7c7a4b94-a976-420a-9685-0d60b7eedd36" />

# Table of contents

- [ecommercewebsite.me](#ecommercewebsite.me)
- [Table of contents](#table-of-contents)
- [Demo](#demo)
- [Features](#features)
- [Usage](#usage)
	- [Purchase products](#purchase-products)
		- [Pay with Stripe method (recommended)](#pay-with-stripe-method-recommended)
		- [Pay with the PayPal method](#pay-with-the-paypal-method)
	- [Receive an order](#receive-an-order)
	- [Access the admin dashboard](#access-the-admin-dashboard)
	- [Perform CRUD operations on the product database (create, update, delete)](#perform-crud-operations-on-the-product-database-create-update-delete)
- [Installation](#installation)
	- [Running on Docker Desktop](#running-on-docker-desktop)
- [Setup Kubernetes Secret](#setup-kubernetes-secret)
- [Deployment](#deployment)
  - [Deploy on Azure (Terraform + Azure DevOps)](#deploy-on-azure-terraform--azure-devops)
  -  [Sign up for an account](#sign-up-for-an-account)
- [Technology](#technology)
- [Disclaimer](#disclaimer)

# Demo

[(Back to top)](#table-of-contents)

_You can  run it manually with docker-desktop on your local machine._

# Features

[(Back to top)](#table-of-contents)

ecommercewebsite.me's features include:

- A fully operational **microservices-architecture** website with user, product, order, payment, and expiration services completely separated.
- All user, product, order, and payment data is stored in separate **MongoDB** collections.
  <img width="1919" height="953" alt="image" src="https://github.com/user-attachments/assets/ccaf7131-b3e0-4b0f-b531-229fc99c95a3" />

- User authentication secured by encrypting passwords using **JWT** and cookies.
- A customer account settings dashboard to update profile information or see all orders.
- An admin management dashboard with the authority to add, edit, and delete a product, user, or order.
- Detailed product information with multiple options, such as color and size, displayed in a fashionable design with the **Swiper** library.
- A full-featured shopping cart, including the ability to add, edit, and remove items.
- A fully functional checkout process, including login, shipping address selection, and payment method selection.
- Acceptance of both **PayPal and Stripe** integration payment methods.
- Ability for an admin to mark orders as delivered.
- The ability for customers to make product reviews and ratings with instant calculation of new ratings.
- The ability to accept coupon promotions.
- A cool navigation bar and breadcrumb for easy navigation.
- Implementation of the **Optimistic concurrency control** concept with Mongoose to handle concurrency issues with event flow.
- Optimization of **Next.js** features to maximize performance and quality in the Lighthouse report.
- A safely secured **HTTPS protocol** with Let's Encrypt certificate.
- Integration of **Google Analytics 4** script to track significant events on the website.
  <!-- - Integrate wishlist in user data (work in process...) -->
  <!-- - Product search feature (work in process...) -->
  <!-- - Sorting and filtering all products on store (work in process...) -->

	<!--
	Something might be a bit exaggerated but one certain thing is that I put all my into creating this project.
	happy browsing! 😊
	-->

# Usage

[(Back to top)](#table-of-contents)

This readme file provides an overview of the usage of the ecommercewebsite.me website. Here are some instructions on how to use the website's features:

## Purchase products
### Pay with Stripe method (recommended)
1. Use the following card number: `4242 4242 4242 4242`.
2. Use any future date for `MM/YY`.
3. Use any number for `CVC`.

### Pay with the PayPal method
1. You will need a PayPal account.
2. Create a PayPal developer account by visiting [https://developer.paypal.com/tools/sandbox/accounts/](https://developer.paypal.com/tools/sandbox/accounts/).
3. Choose the PayPal payment method and sign in with your sandbox account to pay for an order (with fake money).

## Receive an order
1. Only an admin can change an order status to `delivered`.
2. You will never receive any real products (even if your order has been marked as `delivered`). 

## Access the admin dashboard
1. To access the admin dashboard, sign in with an admin account.
2. Access the dashboard through the management menu in the profile dropdown menu.

## Perform CRUD operations on the product database (create, update, delete)
To perform CRUD operations on the product database, you need permission to access this function as an admin.

# Installation

[(Back to top)](#table-of-contents)

## Running on Docker Desktop

[![Docker Badge](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

Follow the below steps to run this project on Docker Desktop:

1. Clone the `dev` branch on your computer.

2. Install the following software:
   * [Node.js](https://nodejs.org/en/)
   * [Skaffold](https://skaffold.dev/)
   * [Docker](https://www.docker.com/)

3. Enable Kubernetes in Docker Desktop preferences.

4. Run this script by executing the following command in the root directory of this project:

```sh
source setup.sh
```

The script will prompt you to enter your Docker registry account name and will build and push the Docker images for each folder that contains a `Dockerfile`.

If you prefer to do it manually.
Run the following command in each folder that contains a `Dockerfile`.

```sh
docker build -t <YOUR_DOCKER_ACCOUNT_NAME>/<CONTAINER_NAME> .
docker push <YOUR_DOCKER_ACCOUNT_NAME>/<CONTAINER_NAME>
```

5. View the list of Kubernetes contexts and select a new context by running these commands:

```sh
kubectl config get-contexts
kubectl config use-context docker-desktop
```

6. Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and enable Kubernetes in Docker Desktop software. (choose _don't have Helm_ version)

7. For Windows users, open the host file at `C:\Windows\System32\drivers\etc\hosts`. For Mac users, open the host file at `/etc/hosts`. Then, add `127.0.0.1 YOUR_CUSTOM_URL` and save the file as an admin. For example, `127.0.0.1 custom.com`.

8. Configure the `infra/k8s-dev/ingress-srv.yaml` file at line 10 to be your custom URL. (ex. mywebsite.com)

9. Create all [Kubernetes secrets](#setup-kubernetes-secret).

10. Run this script in the root directory of this project, and make sure to use the correct context before running the command.

```
skaffold dev
```

11. Open a web browser and enter your custom URL with `https://` to see this project come to life!

Please note that the `setup.sh` script is designed to streamline the installation process by automatically building and pushing Docker images for each folder that contains a `Dockerfile`. This helps simplify the steps required to set up the project on Docker Desktop.

# Setup Kubernetes Secret

[(Back to top)](#table-of-contents)

Create all these Kubernetes secrets in the Kubernetes context:

**MONGO_URI_USER, MONGO_URI_PRODUCT, MONGO_URI_ORDER, MONGO_URI_PAYMENT** : [MongoDB](https://www.mongodb.com/)
```
kubectl create secret generic mongo-secret \
"--from-literal=MONGO_URI_PRODUCT=<YOUR_MONGO_DB_URI>" \
"--from-literal=MONGO_URI_USER=<YOUR_MONGO_DB_URI>" \
"--from-literal=MONGO_URI_ORDER=<YOUR_MONGO_DB_URI>" \
"--from-literal=MONGO_URI_PAYMENT=<YOUR_MONGO_DB_URI>"
```

Example for YOUR_MONGO_DB_URI: `mongodb+srv://admin:<password>@ecommercewebsite.me.ygmpl.mongodb.net/<your_database_name>?retryWrites=true&w=majority`

**JWT_KEY : --whatever you want--**
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<YOUR SECRET>
```

**STRIPE_KEY** : [Stripe](https://stripe.com/)
```
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<YOUR_STRIPE_KEY>
```

**PAYPAL_CLIENT_ID** : [Paypal](https://developer.paypal.com/home)
```
kubectl create secret generic paypal-secret --from-literal=PAYPAL_CLIENT_ID=<YOUR_PAYPAL_CLIENT_ID>
```

# Deployment

[(Back to top)](#table-of-contents)

## Deploy on Azure (Terraform + Azure DevOps)

This deployment uses Terraform for infrastructure provisioning and Azure DevOps pipelines for image builds and AKS deployments.

1. Provision Azure infrastructure with Terraform: https://github.com/Sonaligup-creator/Terraform-Infra
2. Use Azure DevOps pipelines to build and push images to ACR.
3. Deploy manifests to AKS and validate ingress and TLS.
   (Short note - for saving Azure portal charges, I may delete the resources temporarily and create back again so you can test this by youreself by implementing on your machine)
   <img width="1919" height="925" alt="image" src="https://github.com/user-attachments/assets/2d895612-67d2-4f7e-9e87-adac8a64e4d0" />
	 <img width="1919" height="947" alt="image" src="https://github.com/user-attachments/assets/29f326c2-9826-4522-84f7-740a3e88d6ae" />
	 <img width="1918" height="951" alt="image" src="https://github.com/user-attachments/assets/77e6bb42-8ca0-447c-bea4-ca286596fdf5" />



## Sign up for an account
1. To create an account, visit the url where you have hosted the website 
2. Enter your email, password, name, gender, and age (these can be fictional since ecommercewebsite.me is a fictional store).
   (Short note - for saving Azure portal charges, I may delete the resources temporarily and create back again so you can test this by youreself by implementing on your machine)
   <img width="1919" height="936" alt="image" src="https://github.com/user-attachments/assets/04adf08f-c14f-46fd-baa2-aedb81ba587c" />

   <img width="1919" height="961" alt="image" src="https://github.com/user-attachments/assets/b876030d-98fc-4a2b-9e5c-352b14399555" />



# Technology

[(Back to top)](#table-of-contents)

This project is built using the following technologies:

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Azure DevOps](https://azure.microsoft.com/products/devops/)
- [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/products/kubernetes-service/)
- [Azure Container Registry (ACR)](https://azure.microsoft.com/products/container-registry/)
- [Terraform](https://www.terraform.io/)
- [NATS Streaming Server](https://docs.nats.io/nats-streaming-concepts/intro)
- [Skaffold](https://skaffold.dev/)
- [NPM package](https://www.npmjs.com/)

# Disclaimer

[(Back to top)](#table-of-contents)

All images used in this project are for educational purposes only. 


