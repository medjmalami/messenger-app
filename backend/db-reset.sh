#!/usr/bin/env bash
rm -rf drizzle
docker comopse rm messenger_db
sudo rm -rf <path mte3 volumes>
bun drizzle-kit generate
docker-compose up -d
bun drizzle-kit migrate