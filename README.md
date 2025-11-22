# new-app

This repository contains a minimal full-stack example:

- Frontend: React (Vite)
- Backend: Node + Express
- Database: Postgres (init SQL provided)
- Dockerfiles for each component
- Kubernetes manifests to run on Docker Desktop Kubernetes
- GitHub Actions workflow to build and push images to Docker Hub and optionally deploy to Kubernetes

Important: replace the placeholder image names in `k8s/*` with your Docker Hub username or set the `DOCKERHUB_USERNAME` secret in GitHub Actions (see below).

Quick overview
1. Create two GitHub secrets in your repository settings:
	- `DOCKERHUB_USERNAME` — your Docker Hub username
	- `DOCKERHUB_TOKEN` — a Docker Hub access token or password
2. (Optional) If you want GitHub Actions to apply the manifests to a cluster, set `KUBECONFIG` secret to the base64-encoded kubeconfig of the target cluster.

Local run (recommended for development)

Prereqs:
- Docker Desktop with Kubernetes enabled (for local K8s)
- kubectl installed and configured (for local cluster)

Steps to run locally:

1. Build and run with Docker Compose (if you want fast local run) — not included by default; instead you can build images and run containers directly.

2. Build images locally and tag with your Docker Hub username (example `myuser`):

	Replace `myuser` with your Docker Hub username in the commands below.

	```powershell
	# Build frontend
	docker build -t myuser/frontend:latest ./frontend
	# Build backend
	docker build -t myuser/backend:latest ./backend
	# Build DB image (optional)
	docker build -t myuser/db:latest ./db
	```

3. Push to Docker Hub:

	```powershell
	docker push myuser/frontend:latest
	docker push myuser/backend:latest
	docker push myuser/db:latest
	```

4. Update the images used in `k8s/*.yaml` to `myuser/<component>:latest` (or leave as-is and replace `your-dockerhub-username` with your actual username).

5. Deploy to local Docker Desktop Kubernetes:

	```powershell
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/db-deployment.yaml
	kubectl apply -f k8s/backend-deployment.yaml
	kubectl apply -f k8s/frontend-deployment.yaml
	```

6. Check pods and services:

	```powershell
	kubectl get pods -n new-app
	kubectl get svc -n new-app
	```

7. Access frontend: If using `NodePort` for the frontend service, find the node port and open http://localhost:<nodePort>.

CI/CD (GitHub Actions)

- The workflow `.github/workflows/ci-cd.yml` will build and push images to Docker Hub when you push to `main` branch.
- Provide `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` as repository secrets.
- Optional: provide `KUBECONFIG` (base64-encoded kubeconfig) to let the workflow `kubectl apply` the manifests to a remote cluster.

Notes and limitations
- GitHub Actions cannot directly access your local Docker Desktop Kubernetes unless you expose its kubeconfig and allow access from the runner; typically you deploy to a cloud cluster or provide a `KUBECONFIG` secret from a cluster reachable by GitHub Actions.
- For local development, I recommend building images locally and applying manifests to the Docker Desktop cluster.

Next steps (optional):
- Add health probes and resources to the k8s manifests.
- Add a PersistentVolumeClaim for Postgres data.
- Secure secrets with Kubernetes Secrets rather than hardcoding values.

Using Argo CD (GitOps)

This repository can be used with Argo CD. The CI now updates the image tags in `k8s/*.yaml` (the CI replaces the `IMAGE_TAG` placeholder with the commit SHA and commits the change back to `main`). Argo CD should be installed in your cluster and configured to watch this repository's `k8s` path.

Steps to use Argo CD:
1. Install Argo CD in your cluster (see https://argo-cd.readthedocs.io/).
2. Add the `argocd-application.yaml` found in `k8s/` to Argo CD or apply it if Argo CD has access to the repo. Replace `repoURL` in `argocd-application.yaml` with your repository URL.
3. When CI builds and pushes images it will update `k8s/*.yaml` with the new SHA-tagged images and push to `main`; Argo CD will detect the change and sync the cluster.

Security note: prefer creating a limited service-account for Argo CD if you expose Argo CD's API or configure webhook-based syncs. Also prefer using GitHub Environments + required reviewers for any production deploy flows.

