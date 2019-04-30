docker build -t rhedgomez/multi-client:latest -t rhedgomez/multi-client:$SHA -f ./client/Dockerfile ./client #./client/Dockerfile - build context
docker build -t rhedgomez/multi-server:latest -t rhedgomez/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t rhedgomez/multi-worker:latest -t rhedgomez/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push rhedgomez/multi-client:latest
docker push rhedgomez/multi-server:latest
docker push rhedgomez/multi-worker:latest

docker push rhedgomez/multi-client:$SHA #$SHA(GIT_SHA) uniquer version identifier of the image
docker push rhedgomez/multi-server:$SHA
docker push rhedgomez/multi-worker:$SHA

helm init --service-account tiller --upgrade

kubectl apply -f k8s #i think dire nimo himo-on ang helm install, but how?

#set image imperative command; to  always tell kubernetes to use the updated image
kubectl set image deployments/server-deployment server=rhedgomez/multi-server:$SHA
kubectl set image deployments/client-deployment client=rhedgomez/multi-client:$SHA
#this is how kubernetes is going to use the latest image: example: kubectl set image deployments/client-deployment client=rhedgomez/multi-client:testing-image
kubectl set image deployments/worker-deployment worker=rhedgomez/multi-worker:$SHA


#server=rhedgomez/multi-server; server= is like the server container inside this deployment needs to use the image that is explicitly specified


