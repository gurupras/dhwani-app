FROM ubuntu:20.04

ENV NODE_VERSION=16

RUN apt-get update -qq
RUN apt-get -y upgrade -qq

RUN DEBIAN_FRONTEND=noninteractive TZ=America/New_York apt-get -y install \
  autoconf \
  automake \
  build-essential \
  cmake \
  git-core \
  libssl-dev \
  libfreetype6-dev \
  libsdl2-dev \
  libtool \
  libva-dev \
  libvdpau-dev \
  libvorbis-dev \
  libxcb1-dev \
  libxcb-shm0-dev \
  libxcb-xfixes0-dev \
  pkg-config \
  texinfo \
  wget \
  zlib1g-dev \
  nasm \
  yasm \
  libvpx-dev \
  libopus-dev

RUN GIT_SSH_COMMAND="ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" git clone https://github.com/FFmpeg/FFmpeg ffmpeg

WORKDIR ffmpeg

ENV BUILD=/ffmpeg/build
ENV BINDIR="/usr/local/bin"
ENV PATH="${BINDIR}:$PATH"
ENV PKG_CONFIG_PATH="${BUILD}/lib/pkgconfig"

RUN ./configure \
  --disable-shared \
  --enable-static \
  --prefix="${BUILD}" \
  --pkg-config-flags="--static" \
  --extra-cflags="-I${BUILD}/include" \
  --extra-ldflags="-L${BUILD}/lib" \
  --extra-libs="-lpthread -lm" \
  --bindir="${BINDIR}" \
  --enable-libfreetype \
  --enable-libopus \
  --enable-libvpx \
  --enable-openssl


RUN PATH="${BINDIR}:$PATH" make -j16
RUN make install

# NodeJS
RUN apt-get install -y build-essential python3-pip clang curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN mkdir -p /var/lib/dbus
RUN cat /proc/sys/kernel/random/uuid > /var/lib/dbus/machine-id

