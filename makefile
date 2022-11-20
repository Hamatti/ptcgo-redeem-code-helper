build:
	mkdir -p dist/ && zip -r dist/ptcgo-redeem-helper-extension.xpi ./* -x dist/\* .gitignore tests/\* docs/\* makefile