#!/bin/bash

CLIENT_DIR="chatgpt-client"
SERVER_DIR="chatgpt-server/Chatgpt"
AUTH_DIR="chatgpt-server/Auth"
SERVER_IP="89.169.154.188"
HELM_COMMAND="helm upgrade netiq netiq-k8s --values netiq-k8s/values.yaml"

bash chatgpt-client/deploy-client.sh "${CLIENT_DIR}" &
bash chatgpt-server/Chatgpt/deploy-server.sh "${SERVER_DIR}" &
bash chatgpt-server/Auth/deploy-auth.sh "${AUTH_DIR}" &

wait

echo -e "\e[32mAll scripts have finished running.\e[0m"

echo -e "\e[32mConnecting to the server to run helm upgrade...\e[0m"
ssh yegor@"${SERVER_IP}" "${HELM_COMMAND}"

if [ $? -eq 0 ]; then
    echo -e "\e[32mHelm upgrade completed successfully.\e[0m"
else
    echo -e "\e[31mHelm upgrade failed.\e[0m"
fi