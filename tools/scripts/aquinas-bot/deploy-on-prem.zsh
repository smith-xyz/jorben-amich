docker compose build --no-cache && docker save aquinas-bot:latest | ssh -C $1 "docker load && \
    docker stop aquinas-bot && \
    docker remove aquinas-bot && \
    docker run --name aquinas-bot --env-file ./env/aquinas-bot/.env -d aquinas-bot:latest"