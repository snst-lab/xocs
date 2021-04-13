Version
=============

>## Scheme

The versioning scheme we refer is [Semantic Versioning](https://semver.org/)

#### <PROJECTNAME\>-<MAJOR\>.<MINOR\>.<PATCH\>

| Type | Description | Commit Title | Commit Message |
|:----------:|:-------------|:-------------|:-------------|
|**Major**| Incompatible API changes | major-x.0.0 | version x.0.0 released / add: A / add: B / improve:A / ...   |
|**Minor**| Adding functionality in a backwards-compatible | minor-x.x.0 | add:A |
|**Patch**| Bug fixes or improving functionality. | patch-x.x.x | fix: A,  improve: B,  refactor: C, style: D |
<summary><div> 

#### Rules of Commit Title
- **major-x.0.0** : Major update with summarizing multiple commits
- **minor-x.x.0** : Minor update with summarizing multiple commits
- **patch-x.x.x** : Patch with summarizing multiple commits
- **add**  : Add a new function
- **fix**  : Fixed a bug of functions
- **improve** : Improve performance or convenience of functions
- **refactor** : Change of source code or file name without improvement
- **style** :  Change of appearance of UI.
- **asset** :  Edit image, icon, audio or movie materials, etc.
- **doc** :  Edit documents.
- **dir** :  Change directory structure.

<br>
<br>

> ## Roadmap and History
- **Roadmap** -  [ ] unchecked
- **History** - [x] checked

>### Major
### Version x

- [x] 0. beta release
- [ ] 1. production release

<br>


>### Minor
### Version 0.x

- [x] 1. add Watcher, FTP, Task runner,Processor (SCSS, Postcss, Imagemin) support 
- []  2. add SFTP support
- []  3. add Babel transpiler
- []  4. add HTML copy with appending cache parameter 

<br>

>### Patch
### Version 0.1.x
<details open>
<summary>1</summary>

- fix - require in Config <br>
- add - Watcher.throttle
</details>

<details open>
<summary>3</summary>

- improve - npm root path expression<br>
- improve - Watcher.runAtStart
</details>

<details open>
<summary>7</summary>

- fix - install scripts<br>
</details>

<details open>
<summary>9</summary>

- improve - downgrade node version 10.17 -> 10.13 <br>
</details>

