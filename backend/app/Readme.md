# to build a docker that can connect on the same network as the sql 
docker run -d -p 8000:80 --name app --network app_default app 
