develop:
	npx webpack serve --open --port 8080 --host 10.0.2.15

start:
	npm start

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint . --fix

test:
	npm test -- -u

test-coverage:
	npm test -- --coverage --coverageProvider=v8
