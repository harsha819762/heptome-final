terraform {
  required_version = ">= 1.0.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  type        = string
  description = "The GCP project ID to deploy resources to."
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "The GCP region for the Serverless NEG."
}

variable "service_name" {
  type        = string
  default     = "heptome-web"
  description = "The name of the Cloud Run service to load balance."
}

# 1. Serverless Network Endpoint Group (NEG)
resource "google_compute_region_network_endpoint_group" "serverless_neg" {
  name                  = "heptome-serverless-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region

  cloud_run {
    service = var.service_name
  }
}

# 2. Global Static IP Address
resource "google_compute_global_address" "lb_ip" {
  name = "heptome-lb-static-ip"
}

# 3. Global Backend Service
resource "google_compute_backend_service" "backend" {
  name        = "heptome-backend-service"
  port_name   = "http"
  protocol    = "HTTP"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.serverless_neg.id
  }
}

# 4. URL Map (Load Balancer Default Path Routing)
resource "google_compute_url_map" "url_map" {
  name            = "heptome-url-map"
  default_service = google_compute_backend_service.backend.id
}

# 5. Target HTTP Proxy (Translates HTTP to Backend Requests)
resource "google_compute_target_http_proxy" "http_proxy" {
  name    = "heptome-http-proxy"
  url_map = google_compute_url_map.url_map.id
}

# 6. Global Forwarding Rule (Exposes the Load Balancer IP to port 80)
resource "google_compute_global_forwarding_rule" "forwarding_rule" {
  name                  = "heptome-http-forwarding-rule"
  ip_address            = google_compute_global_address.lb_ip.address
  ip_protocol           = "TCP"
  port_range            = "80"
  target                = google_compute_target_http_proxy.http_proxy.id
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

# Outputs
output "load_balancer_ip" {
  value       = google_compute_global_address.lb_ip.address
  description = "The public IP address of the Heptome load balancer."
}
