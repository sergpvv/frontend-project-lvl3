develop:
	rm -rf dist
	npx webpack-dev-server --host 0.0.0.0 --public 10.0.2.15:8080 --watch-poll

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint . --fix

