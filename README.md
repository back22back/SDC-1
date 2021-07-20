# BetterStroms-SystemDesign
A backend system horizontally scaled to be capable of handling high traffic volumes for the BetterStroms Front End.

Managed millions of entries with PostgreSQL, performed complex aggregation functions in one query to fetch various data from multiple tables, achieving a speed of <10ms per query.

Containerized docker image of the Express servers and deployed on AWS EC2 instances to standardize app environments for stability, modularity, and quicker deployment of the servers.

Performed horizontal scaling with Nginx on a total of 8 AWS AMI images to ensure stable access to the database and ultimately improving the capabilities from 100req/s to 2500 req/s for 30s with <1% error rate.

Stress tested with k6, loader.io, and new relics to monitor Nginx and servers’ request load for improving performance with other tools.

## Tech Stack
- Express.js
- PostgreSQL
- Docker/Docker Hub
- Nginx
- New Relic
- K6/loaderio
- AWS (EC2)

