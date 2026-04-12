docker run -d --name=loki -p 3100:3100 grafana/loki
docker run -d -p 8000:3000 --name=grafana grafana/grafana-oss
