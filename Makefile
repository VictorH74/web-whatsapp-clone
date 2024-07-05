run:
	docker-compose up

rebuild:
	docker-compose down --remove-orphans --volumes
	docker-compose build

down: 
	docker-compose down