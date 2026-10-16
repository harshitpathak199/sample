
# Use a lightweight Nginx web server
FROM nginx:alpine

# Copy website files into the Nginx web directory
COPY . /usr/share/nginx/html/

# Expose HTTP port
EXPOSE 80
