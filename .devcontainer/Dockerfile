# [Dockerfile] Dev container with Podman support

FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install Node.js (latest LTS) and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
  && apt-get install -y nodejs

# Install Podman
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
  && source /etc/os-release \
  && echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/ /" | tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list \
  && curl -L "https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/Release.key" | apt-key add - \
  && apt-get update \
  && apt-get install -y podman \
  && rm -rf /var/lib/apt/lists/*

# Configure Podman for rootless operation
RUN echo "vscode:100000:65536" >> /etc/subuid \
  && echo "vscode:100000:65536" >> /etc/subgid

# Set up Podman socket directory
RUN mkdir -p /run/podman && \
    chown vscode:vscode /run/podman

# Configure system for rootless Podman
RUN echo "kernel.unprivileged_userns_clone=1" > /etc/sysctl.d/00-local-userns.conf

USER vscode

# Initialize Podman configuration
RUN mkdir -p ~/.config/containers && \
    echo '[engine]' > ~/.config/containers/containers.conf && \
    echo 'cgroup_manager = "cgroupfs"' >> ~/.config/containers/containers.conf && \
    echo 'events_logger = "file"' >> ~/.config/containers/containers.conf

VOLUME ["/run/podman"]