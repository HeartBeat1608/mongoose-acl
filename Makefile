clean:
	rm -rf lib

build: clean
	tsc

dev:
	ts-node src/index.ts

start: build
	node lib/index.js

test:
	yarn jest