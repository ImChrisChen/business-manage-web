#!/usr/bin/env bash

#source "./scripts/update_version_push.sh"

image_name="imchrisorz/business-manage-web"

ver=$(cat ./package.json | grep -e '"version":' | tr -cd "[0-9].")

docker build -t "${image_name}:${ver}" .

docker tag "${image_name}:${ver}" "${image_name}:latest"

# docker push "${image_name}:latest"
docker push $image_name --all-tags
