# 정적 사이트 배포용
FROM nginx:stable-alpine
# Vite 빌드 결과 복사
COPY ./dist /usr/share/nginx/html
# SPA 라우팅을 위해 커스텀 설정 사용
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# gzip 등 기본 최적화는 nginx.conf에서
EXPOSE 80