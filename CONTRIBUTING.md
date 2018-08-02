# Contributing to wavefile

**wavefile** welcomes all contributions from anyone willing to work in good faith with other contributors and the community. No contribution is too small and all contributions are valued.

## Sample files for tests
Real world files are needed to test **wavefile** features. As some aspects of the WAVE format specification are not quite popular, files with some characteristics may be hard to obtain.

If you plan to add sample files to be used in tests, they should go on the *test/files/* folder.

Look at the [ROADMAP.md](ROADMAP.md) to see if you have any .wav file that could be used to test the incoming features.

### Files created by yourself
If you created the file yourself you should use this naming convention:  
bitDepth-SampleRate-numChannels-origin-fileSpecificData.wav

*origin* is the software used to create the file (like Reaper).

*fileSpecificData* may appear many times, one for each characteristic of the file that is considered relevant.

example:  
16bit-8kHz-1c-reaper-adpcm.wav

### Files from the web
If you add a file that is publicly available on the web, the file should keep the same name from where it was originally available and be included in *test/files/ORIGINS.md*.

Publicaly available files that have been modified for test purposes should follow this naming convention:  
originalNameOfTheFile-fileSpecificData.wav

Where *fileSpecificData* may appear many times, one for each characteristic of the file that is considered relevant. The original file should also be present and listed in *test/files/ORIGINS.md*.

## Bug fixes and features
Bug fixes and features should always come with tests. Look at other tests to see how they should be structured.

### To run the tests:
```
npm test
```

### To build:
```
npm run build
```
Look at [BUILDING.md](BUILDING.md) for details on building **wavefile**.

## Style guide
**wavefile** code should follow the Google JavaScript Style Guide:  
https://google.github.io/styleguide/jsguide.html

## Code of conduct
This project is bound by a Code of Conduct: The [Contributor Covenant, version 1.4](CODE_OF_CONDUCT.md), also available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

## Developer's Certificate of Origin 1.1
By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I
  have the right to submit it under the open source license
  indicated in the file; or

* (b) The contribution is based upon previous work that, to the best
  of my knowledge, is covered under an appropriate open source
  license and I have the right under that license to submit that
  work with modifications, whether created in whole or in part
  by me, under the same open source license (unless I am
  permitted to submit under a different license), as indicated
  in the file; or

* (c) The contribution was provided directly to me by some other
  person who certified (a), (b) or (c) and I have not modified
  it.

* (d) I understand and agree that this project and the contribution
  are public and that a record of the contribution (including all
  personal information I submit with it, including my sign-off) is
  maintained indefinitely and may be redistributed consistent with
  this project or the open source license(s) involved.
