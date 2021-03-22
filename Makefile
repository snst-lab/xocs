### Makefile for install of develepment environment
#
# install command
# > make install

.PHONY: install

vscode-plugin:
	@code --install-extension esbenp.prettier-vscode
	@code --install-extension stylelint.vscode-stylelint
	@code --install-extension dbaeumer.vscode-eslint
	@code --install-extension oouo-diogo-perdigao.docthis

publish:
	@npm publish

prepublish:
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

install:
	@npm set progress=false
	@npm i -g pnpm
	@make dependencies
	@make devDependencies
	@npm set progress=true

dependencies:
	@pnpm i @types/app-root-path @types/browser-sync @types/ftp @types/imagemin-gifsicle @types/imagemin-mozjpeg @types/imagemin-svgo @types/imagemin-webp @types/node app-root-path autoprefixer browser-sync chalk chokidar dotenv ftp imagemin imagemin-pngquant imagemin-mozjpeg imagemin-gifsicle imagemin-svgo imagemin-webp ora postcss postcss-cli sass

devDependencies:
	@pnpm i -D @types/chai @types/mocha @typescript-eslint/eslint-plugin @typescript-eslint/parser chai eslint eslint-config-prettier eslint-plugin-prettier mocha prettier stylelint  stylelint-config-recess-order ts-node tsc tsc-alias tsconfig-paths typescript

git-commit:
	git add -A && git commit

git-clean:
	git rm -r -f --cached .



