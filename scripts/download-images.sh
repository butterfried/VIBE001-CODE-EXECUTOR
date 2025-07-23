#!/bin/bash

echo "Downloading required container images..."

# Pull C++ compiler image
podman pull docker.io/library/gcc:latest

# Pull Java runtime image
podman pull docker.io/library/openjdk:latest

# Pull Node.js runtime image
podman pull docker.io/library/node:latest

echo "All required images downloaded successfully"