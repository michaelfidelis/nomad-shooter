up: 
	@docker compose up -d

down: 
	@docker compose down

test-unit:
	@docker compose run --rm api npm run test

test-e2e:
	@docker compose run --rm api npm run test:e2e

