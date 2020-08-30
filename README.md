# TypeScript Project References Demo

This repo is forked from https://github.com/RyanCavanaugh/project-references-demo.  It is to compare the performance of project references with webpack & ts-loader vs webpack and tsc run in a separate process.

Only the performance changing one typescript source file is measured.  Other times such as the inital build and warm start times will vary between these runs and may be more important to other users.

## Installation
```
yarn install
yarn generate
```
This will run the generate.ts script which will populate zoo/generated with as large a codebase as you wish. Using the settings:
```
const depths = [10,10];
const busyWork = 100;
```
the generated code will contain around 100 files in 2 layers each with 100 repeated blocks of code (900 lines of code) to give the compiler some work to do.

With webpack in watch mode I run <code>yarn build</code>.  After the initial compilation I make a change to <code>zoo/zoo.ts</code>.  Webpack reports 2 compilations (for reasons which are understood).  The first takes 3.2 seconds and the second 0.8s.

This repo contains an additional reference <code>unused</code>.  This project is included as a reference in the root solution file <code>tsconfig.json</code> but is not imported anywhere.  When the projects are rebuilt with <code>tsc -b</code> or with ts-loader with <code>projectReferences</code> set to <code>true</code> the <code>unused</code> project is built and its output will appear in <code>lib</code>.  ts-loader builds the solution in exactly the same way as <code>tsc -b</code>.

I then change the entrypoint in <code>webpack.config.js</code> to point to the compiled javascript:
```
  "entry": "src/index.js",
```
I again run webpack in watch mode using ts-loader with <code>projectReferences</code> set to <code>false</code> and in a second shell run <code>tsc -b -w -v</code>.  After the initial compilation I change <code>zoo/zoo.ts</code>.  webpack reports a build time of less than 1 second but this does not include the time it took <code>tsc</code> to rebuild the reference, which I manually timed at around 4 seconds (probably 3.x seconds if you subtract my reaction time.)

Using babel-loader instead of ts-loader only affects the webpack part of this build, which is already less than 1 second.  Babel-loader does not make it faster.

## Without Project References

I then reset the entrypoint and changed <code>src/index.ts</code> so that it imports the TS code directly, instead of the compiled code in lib:
```
import { createZoo } from '../zoo/zoo';
import { Dog } from '../animals/dog';
```
Now we are not using project references - the TS code will be compiled on each run.  I also set <code>projectReferences</code> to <code>false</code> in <code>webpack.config.js</code>.  After starting webpack in watch mode I made a change in <code>zoo/zoo.ts</code>.  Webpack completed the incremental build in less than 1 second.  This is as expected - webpack only builds the files which are required to be rebuilt.

Of course, <code>tsc -b -w</code> should do this as well, so it is an open question why webpack+ts-loader is able to complete an incremental build faster than <code>tsc -b -w</code>.  Perhaps <code>tsc</code> takes longer because it needs to write its output to the file system.  Webpack in watch mode does this in memory.

I would assume that many people put relatively stable code into project references and gain performance by not having to rebuild the code each time webpack is started.  If other users are actively developing the code in a reference and are bothered by the time it takes to rebuild a referenced project then perhaps they would be advised to include the TypeScript source directly and gain from faster rebuild times.

## Conclusion

On this example, there is no significant difference in rebuild time between running <code>tsc -w</code> in a separate process versus using ts-loader to run it before the build.
