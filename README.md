# not-sync

Disable synchronization for files in cloud storage such as Dropbox, iCloudDrive or OneDrive. Detects cloud storage provider.

# Synopsis

```ts
import { notSync, resync } from "not-sync";
```

```ts
// Disable synchronization for following directories.
await notSync(["node_modules", "coverage", "dist"]);
```

```ts
// Provide cwd for a project located in `${os.homedir()}/Dropbox/project`.
await notSync(["node_modules", "coverage", "dist"], { cwd: `${os.homedir()}/Dropbox/project` });
```

```ts
// If new new files are added to project directory (e.g. iCloudDrive .nosync files) add new files
// to closest ".gitignore". (Here "node_modules.nosync", "coverage.nosync", "dist.nosync")
await notSync(["node_modules", "coverage", "dist"], { ignoreConfigs: [".gitignore"] });
```

```ts
// Enable synchronization for following directories.
await resync(["node_modules", "coverage", "dist"]);
```

```ts
await notSync(["node_modules", "coverage", "dist"], {
  cwd: "path/to/cwd",
  ignoreConfigs: [".gitignore", ".prettierignore"],
  dry: false;
  on: {
    found: (service, files) => { },
    notFound: (files) => { },
    move: (service, from, to) => { },
    moveFail: (service, errorCode, from, to) => { },
    symlink: (service, target, path) => { },
    delete: (service, path, type) => { },
    addEntry: (service, ignoreFile, entries) => { },
    deleteEntry: (service, ignoreFile, entries) => { },
  },
  verbose: false,
  roots: {
    iCloudDrive: os.platform() === "darwin"
      ? `${os.homedir()}/Library/Mobile Documents/com~apple~CloudDocs/`
      : `${os.homedir()}/iCloudDrive`,
    dropBox: `${os.homedir()}/Dropbox`,
    oneDrive: `${os.homedir()}/OneDrive`
  }
  targetRoots: {
    iCloudDrive: `${iCloudDriveRoot}/../iCloudDrive Linked Files`
    dropBox: `${dropboxRoot}/../Dropbox Linked Files`,
    oneDrive: `${oneDriveRoot}/../OneDrive Linked Files`,
  }
  linkSameDir: true, // Add ".nosync" files to near of original files for "iCloudDrive".
})
```

## Minimal CLI

For more advanced options, please use [not-sync-cli](https://www.npmjs.com/package/not-sync-cli)

```sh
$ not-sync node_modules,dist,coverage
```

# Details

This module disables and enables synchronization of given files and directories from cloud storage. Possibly could be used to save space, time and sometimes prevent headache, especially for heavy by size and number of files directories such as `node_modules`.

`notSync` function moves files/directories to another non-synchronized path (see table below) and creates a symbolic link in place of original files. `resync` function deletes symbolic links and moves files back to original place.

# Features

- Could be used more than one cloud storage services.
- Provides `resync` method for undoing changes.
- Auto detect cloud storage service from file path.
- Could use `.nosync` extension for `iCloudDrive`.
- Minimal CLI. For more advanced options, please use [not-sync-cli](https://www.npmjs.com/package/not-sync-cli)

Below are examples for `node_modules` directory located in a `project`:

| Service     | Option               | Source                                | Target                                                          |
| ----------- | -------------------- | ------------------------------------- | --------------------------------------------------------------- |
| iCloudDrive |                      | `${iCloudDrive}/project/node_modules` | `${iCloudDrive}/project/node_modules.nosync`                    |
| iCloudDrive | `linkSameDir: false` | `${iCloudDrive}/project/node_modules` | `${os.homedir()}/iCloudDrive Linked Files/project/node_modules` |
| Dropbox     |                      | `${Dropbox}/project/node_modules`     | `${os.homedir()}/Dropbox Linked Files/project/node_modules`     |
| OneDrive    |                      | `${OneDrive}/project/node_modules`    | `${os.homedir()}/OneDrive Linked Files/project/node_modules`    |

Target directory can be changed using `targetRoots` option.

<!-- usage -->

<!-- commands -->

# API

<a name="readmemd"></a>

not-sync

# not-sync

## Table of contents

### Interfaces

- [Events](#interfaceseventsmd)
- [Options](#interfacesoptionsmd)

### Type aliases

- [MoveErrorCode](#moveerrorcode)
- [OnAddEntry](#onaddentry)
- [OnDelete](#ondelete)
- [OnDeleteEntry](#ondeleteentry)
- [OnFound](#onfound)
- [OnMove](#onmove)
- [OnMoveFail](#onmovefail)
- [OnNotFound](#onnotfound)
- [OnSymlink](#onsymlink)
- [ServiceKey](#servicekey)

### Functions

- [notSync](#notsync)
- [resync](#resync)

## Type aliases

### MoveErrorCode

Ƭ **MoveErrorCode**: _NOSRC_ | _LINKEXIST_ | _NOTALINK_ | _NOTFOUND_ | _NOTARGET_

Defined in: [index.ts:6](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L6)

---

### OnAddEntry

Ƭ **OnAddEntry**: (`service`: [_ServiceKey_](#servicekey), `ignoreFile`: _string_, `entries`: _string_[]) => _any_ | _Promise_<_any_\>

Defined in: [index.ts:13](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L13)

---

### OnDelete

Ƭ **OnDelete**: (`service`: [_ServiceKey_](#servicekey), `path`: _string_, `type`: _symlink_ | _parent_) => _any_ | _Promise_<_any_\>

Defined in: [index.ts:12](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L12)

---

### OnDeleteEntry

Ƭ **OnDeleteEntry**: (`service`: [_ServiceKey_](#servicekey), `ignoreFile`: _string_, `entries`: _string_[]) => _any_ | _Promise_<_any_\>

Defined in: [index.ts:14](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L14)

---

### OnFound

Ƭ **OnFound**: (`service`: [_ServiceKey_](#servicekey), `files`: _string_[]) => _any_ | _Promise_<_any_\>

Defined in: [index.ts:7](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L7)

---

### OnMove

Ƭ **OnMove**: (`service`: [_ServiceKey_](#servicekey), `from`: _string_, `to`: _string_) => _any_ | _Promise_<_any_\>

Defined in: [index.ts:9](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L9)

---

### OnMoveFail

Ƭ **OnMoveFail**: (`service`: [_ServiceKey_](#servicekey), `errorCode`: [_MoveErrorCode_](#moveerrorcode), `from?`: _string_, `to?`: _string_) => _any_ | _Promise_<_any_\>

Defined in: [index.ts:10](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L10)

---

### OnNotFound

Ƭ **OnNotFound**: (`files`: _string_[]) => _any_ | _Promise_<_any_\>

Defined in: [index.ts:8](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L8)

---

### OnSymlink

Ƭ **OnSymlink**: (`service`: [_ServiceKey_](#servicekey), `target`: _string_, `path`: _string_) => _any_ | _Promise_<_any_\>

Defined in: [index.ts:11](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L11)

---

### ServiceKey

Ƭ **ServiceKey**: _iCloudDrive_ | _dropbox_ | _oneDrive_

Defined in: [cloud-service/cloud-service.ts:21](https://github.com/ozum/not-sync/blob/8bda958/src/cloud-service/cloud-service.ts#L21)

## Functions

### notSync

▸ **notSync**(`paths`: _string_[], `options?`: [_Options_](#interfacesoptionsmd)): _Promise_<_void_\>

#### Parameters:

| Name      | Type                              | Default value |
| --------- | --------------------------------- | ------------- |
| `paths`   | _string_[]                        | -             |
| `options` | [_Options_](#interfacesoptionsmd) | ...           |

**Returns:** _Promise_<_void_\>

Defined in: [main.ts:32](https://github.com/ozum/not-sync/blob/8bda958/src/main.ts#L32)

---

### resync

▸ **resync**(`paths`: _string_[], `options?`: [_Options_](#interfacesoptionsmd)): _Promise_<_void_\>

#### Parameters:

| Name      | Type                              | Default value |
| --------- | --------------------------------- | ------------- |
| `paths`   | _string_[]                        | -             |
| `options` | [_Options_](#interfacesoptionsmd) | ...           |

**Returns:** _Promise_<_void_\>

Defined in: [main.ts:28](https://github.com/ozum/not-sync/blob/8bda958/src/main.ts#L28)

# Interfaces

<a name="interfaceseventsmd"></a>

[not-sync](#readmemd) / Events

# Interface: Events

## Hierarchy

- **Events**

## Table of contents

### Properties

- [addEntry](#addentry)
- [delete](#delete)
- [deleteEntry](#deleteentry)
- [found](#found)
- [move](#move)
- [moveFail](#movefail)
- [notFound](#notfound)
- [symlink](#symlink)

## Properties

### addEntry

• `Optional` **addEntry**: _undefined_ | [_OnAddEntry_](#onaddentry)

Defined in: [index.ts:23](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L23)

---

### delete

• `Optional` **delete**: _undefined_ | [_OnDelete_](#ondelete)

Defined in: [index.ts:22](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L22)

---

### deleteEntry

• `Optional` **deleteEntry**: _undefined_ | [_OnDeleteEntry_](#ondeleteentry)

Defined in: [index.ts:24](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L24)

---

### found

• `Optional` **found**: _undefined_ | [_OnFound_](#onfound)

Defined in: [index.ts:17](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L17)

---

### move

• `Optional` **move**: _undefined_ | [_OnMove_](#onmove)

Defined in: [index.ts:19](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L19)

---

### moveFail

• `Optional` **moveFail**: _undefined_ | [_OnMoveFail_](#onmovefail)

Defined in: [index.ts:20](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L20)

---

### notFound

• `Optional` **notFound**: _undefined_ | [_OnNotFound_](#onnotfound)

Defined in: [index.ts:18](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L18)

---

### symlink

• `Optional` **symlink**: _undefined_ | [_OnSymlink_](#onsymlink)

Defined in: [index.ts:21](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L21)

<a name="interfacesoptionsmd"></a>

[not-sync](#readmemd) / Options

# Interface: Options

Options

## Hierarchy

- **Options**

## Table of contents

### Properties

- [createDirs](#createdirs)
- [cwd](#cwd)
- [dry](#dry)
- [ignoreConfigs](#ignoreconfigs)
- [linkSameDir](#linksamedir)
- [on](#on)
- [roots](#roots)
- [targetRoots](#targetroots)
- [verbose](#verbose)

## Properties

### createDirs

• `Optional` **createDirs**: _undefined_ | _boolean_

Create directories for non existing paths. (If they are in a cloud path). This may be used to disable sync of directories to be created in future.

Defined in: [index.ts:46](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L46)

---

### cwd

• `Optional` **cwd**: _undefined_ | _string_

Current working directory to be used for resolving relative paths.

Defined in: [index.ts:30](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L30)

---

### dry

• `Optional` **dry**: _undefined_ | _boolean_

Prevents changes to be written to disk. Executes a dry run.

Defined in: [index.ts:34](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L34)

---

### ignoreConfigs

• `Optional` **ignoreConfigs**: _undefined_ | _string_ | _string_[]

Ignore configuration files (e.g. .gitignore, .prettierignore) to add new created files if any.

Defined in: [index.ts:32](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L32)

---

### linkSameDir

• `Optional` **linkSameDir**: _undefined_ | _boolean_

Move files near original one for iCloudDrive. For example "node_modules" is moved "node_modules.nosync" in same directory.

Defined in: [index.ts:40](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L40)

---

### on

• `Optional` **on**: _undefined_ | [_Events_](#interfaceseventsmd)

Event handler functions to act on several events generated during operation.

Defined in: [index.ts:36](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L36)

---

### roots

• `Optional` **roots**: _undefined_ | _Partial_<_Record_<[_ServiceKey_](#servicekey), _string_\>\>

Roots of cloud services. If default roots has to be changed for same reson.

Defined in: [index.ts:44](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L44)

---

### targetRoots

• `Optional` **targetRoots**: _undefined_ | _Partial_<_Record_<[_ServiceKey_](#servicekey), _string_\>\>

Custom roots for each cloud service to move files.

Defined in: [index.ts:42](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L42)

---

### verbose

• `Optional` **verbose**: _undefined_ | _boolean_

Adds extra information to event handlers.

Defined in: [index.ts:38](https://github.com/ozum/not-sync/blob/8bda958/src/index.ts#L38)

# Related

[not-sync-cli](https://www.npmjs.com/package/not-sync-cli): CLI for this API.
