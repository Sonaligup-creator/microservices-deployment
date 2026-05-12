# MongoDB Atlas Setup & Deployment Guide

This guide explains how to integrate MongoDB Atlas with your AKS deployment and manage secrets.

## 1. Prerequisites

- MongoDB Atlas cluster provisioned (you've already done this)
- Atlas cluster connection string (SRV format): `mongodb+srv://<USER>:<PASS>@<CLUSTER>.mongodb.net/<DB>?retryWrites=true&w=majority`
- Stored in Azure DevOps Mongo-secrets variable group as `mongo-connection-string`
- JWT key stored in Azure DevOps as part of the same variable group

## 2. Terraform Configuration

### Add to your Azure DevOps Pipeline Variables

When running the Terraform apply pipeline, pass these as runtime parameters:

```hcl
terraform apply \
  -var="mongodb_atlas_connection_string=$MONGO_CONNECTION_STRING" \
  -var="jwt_key=$JWT_KEY" \
  ...
```

Or add them to your `environments/prod/terraform.tfvars`:

```hcl
mongodb_atlas_connection_string = "mongodb+srv://appuser:PASSWORD@cluster0.abcd.mongodb.net/ecommerce?retryWrites=true&w=majority"
jwt_key                          = "your-jwt-secret-key"
```

### Terraform Creates

- **Azure Key Vault** (`keyvault.tf`):
  - Stores `mongo-connection-string` and `jwt-key` as secrets.
  - Grants AKS Managed Identity read access.
- **Outputs**:
  - `keyvault_name`: Name of the Key Vault for reference.
  - `mongo_secret_name`: Secret name in Key Vault (`mongo-connection-string`).
  - `jwt_secret_name`: Secret name in Key Vault (`jwt-key`).

## 3. Deploy Kubernetes Secrets

After Terraform creates the Key Vault, create Kubernetes secrets from the Atlas connection string. Choose one:

### Option A: Manual kubectl (for testing)

```bash
# Retrieve the Atlas connection string from your DevOps variable group or Key Vault
export MONGO_URI="mongodb+srv://appuser:PASSWORD@cluster0.abcd.mongodb.net/ecommerce?retryWrites=true&w=majority"
export JWT_KEY="your-jwt-secret"

# Create the mongo-secret with all database URIs pointing to Atlas
kubectl create secret generic mongo-secret \
  --from-literal=MONGO_URI_PRODUCT="$MONGO_URI" \
  --from-literal=MONGO_URI_ORDER="$MONGO_URI" \
  --from-literal=MONGO_URI_USER="$MONGO_URI" \
  --from-literal=MONGO_URI_PAYMENT="$MONGO_URI" \
  --namespace default \
  -o yaml

# Create the jwt-secret
kubectl create secret generic jwt-secret \
  --from-literal=JWT_KEY="$JWT_KEY" \
  --namespace default \
  -o yaml

# Verify
kubectl get secrets
kubectl describe secret mongo-secret
```

### Option B: Azure DevOps Pipeline Step (Recommended)

Add this step to your app deployment pipeline after Terraform applies:

```yaml
- task: AzureCLI@2
  displayName: 'Create Kubernetes Secrets from Azure DevOps Variables'
  inputs:
    azureSubscription: $(serviceConnection)
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      # Get AKS credentials
      az aks get-credentials \
        --resource-group $(TF_VAR_resource_group) \
        --name $(AKS_CLUSTER_NAME) \
        --admin

      # Create mongo-secret with all service URIs pointing to Atlas
      kubectl create secret generic mongo-secret \
        --from-literal=MONGO_URI_PRODUCT="$(MONGO_CONNECTION_STRING)" \
        --from-literal=MONGO_URI_ORDER="$(MONGO_CONNECTION_STRING)" \
        --from-literal=MONGO_URI_USER="$(MONGO_CONNECTION_STRING)" \
        --from-literal=MONGO_URI_PAYMENT="$(MONGO_CONNECTION_STRING)" \
        --namespace default \
        --dry-run=client -o yaml | kubectl apply -f -

      # Create jwt-secret
      kubectl create secret generic jwt-secret \
        --from-literal=JWT_KEY="$(JWT_KEY)" \
        --namespace default \
        --dry-run=client -o yaml | kubectl apply -f -

      echo "Secrets created/updated successfully"
```

## 4. Kubernetes Manifest Updates

The service deployments (`product-depl.yaml`, `order-depl.yaml`, `user-depl.yaml`, `payment-depl.yaml`) already reference the `mongo-secret` and `jwt-secret` Kubernetes secrets.

**Important**: Ensure all MONGO_URI_* environment variables point to the same secret name and appropriate key name (e.g., `MONGO_URI_PRODUCT`, `MONGO_URI_ORDER`).

The manifests reference:
```yaml
env:
  - name: MONGO_URI_PRODUCT
    valueFrom:
      secretKeyRef:
        name: mongo-secret
        key: MONGO_URI_PRODUCT
```

Since MongoDB Atlas is a single cluster used by all services, all keys (`MONGO_URI_PRODUCT`, `MONGO_URI_ORDER`, etc.) in the `mongo-secret` will have the same connection string value. Services can connect to different databases on the same Atlas cluster by specifying the database name in the connection string or in the service code.

## 5. Remove In-Cluster MongoDB Deployments

The following manifest files deploy in-cluster MongoDB instances and are **no longer needed** when using MongoDB Atlas:

- `infra/k8s/product-mongo-depl.yaml`
- `infra/k8s/order-mongo-depl.yaml`
- `infra/k8s/user-mongo-depl.yaml`
- `infra/k8s/payment-mongo-depl.yaml`

These files are commented out (or removed) in the deployment pipeline to prevent unwanted Mongo pods.

If you need them for development/testing, you can keep them but **only apply them when not using Atlas**.

## 6. Network Configuration (Production)

For production deployments using a **private AKS cluster**:

1. Configure **VNet Peering** or **Private Endpoint** between AKS VNet and MongoDB Atlas:
   - Requires Atlas network configuration (refer to MongoDB Atlas VNet Peering docs).
   - Update firewall rules to allow AKS subnet IPs.

2. Update connection string to use private endpoint (if configured):
   - Atlas will provide a private endpoint connection string; update `MONGO_CONNECTION_STRING` accordingly.

## 7. Verification

After deploying secrets and applications:

```bash
# Check secret exists
kubectl get secret mongo-secret -o yaml

# Check pod can access the secret via env var
kubectl exec <pod-name> -- env | grep MONGO_URI_PRODUCT

# Verify service pod logs for successful DB connection
kubectl logs <pod-name> | grep -i "connected\|database"
```

## 8. Troubleshooting

- **Secret not found error**: Ensure `mongo-secret` and `jwt-secret` are created in the same namespace as your services (usually `default`).
- **Connection timeout**: Check firewall/IP allowlist settings in MongoDB Atlas (Network Access).
- **Authentication failed**: Verify username, password, and cluster name in the connection string.
- **Certificate validation errors**: Ensure your client is configured to use TLS/SSL (SRV strings include this by default).

## 9. Next Steps

After secrets are deployed:

1. Update your pipeline to build and push Docker images to ACR.
2. Apply `infra/k8s/*.yaml` manifests (excluding in-cluster Mongo) to deploy services.
3. Configure Ingress and DNS for external access.
4. Set up monitoring and logging.
