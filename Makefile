run:
	docker-compose up

rebuild:
	docker-compose down --remove-orphans --volumes
	sudo rm -r data/
	docker-compose build

down: 
	docker-compose down