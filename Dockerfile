FROM ubuntu:20.04
RUN apt update
# If we don't do this tzdata nonsense, the postgres install requests a manual setting of the timezone
RUN export DEBIAN_FRONTEND=noninteractive; \
    export DEBCONF_NONINTERACTIVE_SEEN=true; \
    echo 'tzdata tzdata/Areas select Etc' | debconf-set-selections; \
    echo 'tzdata tzdata/Zones/Etc select UTC' | debconf-set-selections; \
    apt-get update -qqy \
 && apt-get install -qqy --no-install-recommends \
        tzdata \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
RUN apt update
RUN apt install -y postgresql postgresql-contrib
RUN pg_ctlcluster 12 main start
RUN apt install -y python3.8 python3-pip
COPY . /home
RUN pip install flask psycopg2-binary
RUN /bin/python3.8 /home/application.py