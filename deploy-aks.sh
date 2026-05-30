#!/bin/bash
# Deployment script for AKS with MongoDB Atlas
# This script applies only the manifests needed for AKS + Atlas (excludes in-cluster Mongo/Redis)

set -e

NAMESPACE=${1:-default}
K8S_DIR="infra/k8s"

echo "Deploying microservices to AKS with MongoDB Atlas (namespace: $NAMESPACE)"
echo "=========================================================================="

# Create namespace if not exists
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

echo "Applying infrastructure services..."
# Deploy NATS (message broker) - required
echo "  → Applying NATS deployment..."
kubectl apply -f "$K8S_DIR/nats-depl.yaml" -n $NAMESPACE

# Deploy Expiration service + Redis (for expiration cache)
# Optional: Remove if not using expiration service
echo "  → Applying Expiration service (Redis)..."
kubectl apply -f "$K8S_DIR/expiration-redis-depl.yaml" -n $NAMESPACE
kubectl apply -f "$K8S_DIR/expiration-depl.yaml" -n $NAMESPACE

# Deploy microservices (use ACR images, not placeholder ecommerce/*)
echo ""
echo "Applying microservices deployments..."
echo "  NOTE: Update image names to your ACR in *.yaml before applying"
echo "  Example: <acr-login-server>/product:latest"
echo ""

echo "  → Applying Product service..."
kubectl apply -f "$K8S_DIR/product-depl.yaml" -n $NAMESPACE

echo "  → Applying Order service..."
kubectl apply -f "$K8S_DIR/order-depl.yaml" -n $NAMESPACE

echo "  → Applying User service..."
kubectl apply -f "$K8S_DIR/user-depl.yaml" -n $NAMESPACE

echo "  → Applying Payment service..."
kubectl apply -f "$K8S_DIR/payment-depl.yaml" -n $NAMESPACE

echo "  → Applying Client (Next.js frontend)..."
kubectl apply -f "$K8S_DIR/client-depl.yaml" -n $NAMESPACE

echo ""
echo "=========================================================================="
echo "Deployment complete!"
echo ""
echo "NOTE: The following in-cluster databases are NOT deployed (using Atlas instead):"
echo "  - product-mongo-depl.yaml (MongoDB Atlas instead)"
echo "  - order-mongo-depl.yaml (MongoDB Atlas instead)"
echo "  - user-mongo-depl.yaml (MongoDB Atlas instead)"
echo "  - payment-mongo-depl.yaml (MongoDB Atlas instead)"
echo ""
echo "Ensure Kubernetes secrets are created before pods start:"
echo "  kubectl get secrets -n $NAMESPACE | grep -E 'mongo-secret|jwt-secret'"
echo ""
echo "Check service status:"
echo "  kubectl get deployments -n $NAMESPACE"
echo "  kubectl get pods -n $NAMESPACE"

