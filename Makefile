### Makefile for install of develepment environment
#
# install command
# > make install

.PHONY: install

vscode-plugin:
	@code --install-extension esbenp.prettier-vscode
	@code --install-extension stylelint.vscode-stylelint
	@code --install-extension dbaeumer.vscode-eslint

publish:
	@npm publish

prepublish:
	@rm -rf ./scripts
	@mv ./dist/* .

postpublish:
	@for file in \
	@types \
	bin \
	interfaces \
	modules \
	scripts \
	utils \
	index.d.ts \
	index.js; \
	do mv $$file dist; done
	@mkdir scripts && touch scripts/postinstall.js && echo '/** ! Do not edit or remove this file */' > scripts/postinstall.js

install:
	@npm set progress=false
	@make dependencies
	@make devDependencies
	@npm set progress=true

dependencies:
	@yarn add @types/browser-sync @types/ftp @types/imagemin-gifsicle @types/imagemin-mozjpeg @types/imagemin-svgo @types/imagemin-webp @types/node autoprefixer browser-sync chalk chokidar dotenv ftp imagemin imagemin-pngquant imagemin-mozjpeg imagemin-gifsicle imagemin-svgo imagemin-webp ora postcss postcss-cli sass

devDependencies:
	@yarn add -D @types/chai @types/mocha @typescript-eslint/eslint-plugin @typescript-eslint/parser mocha chai eslint babel-eslint eslint-config-prettier eslint-plugin-prettier prettier stylelint  stylelint-config-recess-order ts-node tsc tsc-alias tsconfig-paths typescript

git-commit:
	git add -A && git commit

git-clean:
	git rm -r -f --cached .



