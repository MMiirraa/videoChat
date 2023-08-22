# KurentoChat MiroslavGe

локально развернуть можно

бэк - npm run dev
фронт - npm start

kurento - вставить полность команду ниже


sudo docker run --rm     -p 8888:8888/tcp     -p 50800-50900:50800-50900/udp     -e KMS_MIN_PORT=50800     -e KMS_MAX_PORT=50900     kurento/kurento-media-server:latest

сначало куренту, потом бэк, потом фронт
