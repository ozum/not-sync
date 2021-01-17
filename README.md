# not-sync

Disable file synchronization for selceted files in an auto detected cloud storage such as Dropbox, iCloudDrive or OneDrive.

# Synopsis

```ts
import { enable, disable } from "not-sync";
```

```ts
// Disable synchronization for following directories.
await disable(["node_modules", "coverage", "dist"]);
```

```ts
// Provide cwd for a project located in `${os.homedir()}/Dropbox/project`.
await disable(["node_modules", "coverage", "dist"], { cwd: `${os.homedir()}/Dropbox/project` });
```

```ts
// If new new files are added to project directory (e.g. iCloudDrive .nosync files) add new files
// to closest ".gitignore". (Here "node_modules.nosync", "coverage.nosync", "dist.nosync")
await disable(["node_modules", "coverage", "dist"], { ignoreConfigs: [".gitignore"] });
```

```ts
// Enable synchronization for following directories.
await enable(["node_modules", "coverage", "dist"]);
```

```ts
await disable(["node_modules", "coverage", "dist"], {
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

# Details

This module disables and enables synchronization of given files and directories from cloud storage. Possibly could be used to save space, time and sometimes prevent headache, especially for heavy by size and number of files directories such as `node_modules`.

`disable` function moves files/directories to another non-synchronized path (see table below) and creates a symbolic link in place of original files. `enable` function deletes symbolic links and moves files back to original place.

# Features

- Could be used more than one cloud storage services.
- Provides `enable` method for undoing changes.
- Auto detect cloud storage service from file path.
- Could use `.nosync` extension for `iCloudDrive`.

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

- [disable](#disable)
- [enable](#enable)

## Type aliases

### MoveErrorCode

Ƭ **MoveErrorCode**: _NOSRC_ \| _LINKEXIST_ \| _NOTALINK_ \| _NOTFOUND_ \| _NOTARGET_

Defined in: index.ts:6

---

### OnAddEntry

Ƭ **OnAddEntry**: (`service`: [_ServiceKey_](#servicekey), `ignoreFile`: _string_, `entries`: _string_[]) => _any_ \| _Promise_<_any_\>

Defined in: index.ts:13

---

### OnDelete

Ƭ **OnDelete**: (`service`: [_ServiceKey_](#servicekey), `path`: _string_, `type`: _symlink_ \| _parent_) => _any_ \| _Promise_<_any_\>

Defined in: index.ts:12

---

### OnDeleteEntry

Ƭ **OnDeleteEntry**: (`service`: [_ServiceKey_](#servicekey), `ignoreFile`: _string_, `entries`: _string_[]) => _any_ \| _Promise_<_any_\>

Defined in: index.ts:14

---

### OnFound

Ƭ **OnFound**: (`service`: [_ServiceKey_](#servicekey), `files`: _string_[]) => _any_ \| _Promise_<_any_\>

Defined in: index.ts:7

---

### OnMove

Ƭ **OnMove**: (`service`: [_ServiceKey_](#servicekey), `from`: _string_, `to`: _string_) => _any_ \| _Promise_<_any_\>

Defined in: index.ts:9

---

### OnMoveFail

Ƭ **OnMoveFail**: (`service`: [_ServiceKey_](#servicekey), `errorCode`: [_MoveErrorCode_](#moveerrorcode), `from?`: _string_, `to?`: _string_) => _any_ \| _Promise_<_any_\>

Defined in: index.ts:10

---

### OnNotFound

Ƭ **OnNotFound**: (`files`: _string_[]) => _any_ \| _Promise_<_any_\>

Defined in: index.ts:8

---

### OnSymlink

Ƭ **OnSymlink**: (`service`: [_ServiceKey_](#servicekey), `target`: _string_, `path`: _string_) => _any_ \| _Promise_<_any_\>

Defined in: index.ts:11

---

### ServiceKey

Ƭ **ServiceKey**: _iCloudDrive_ \| _dropbox_ \| _oneDrive_

Defined in: cloud-service/cloud-service.ts:24

## Functions

### disable

▸ **disable**(`paths`: _string_[], `options?`: [_Options_](#interfacesoptionsmd)): _Promise_<_void_\>

#### Parameters:

| Name      | Type                              | Default value |
| --------- | --------------------------------- | ------------- |
| `paths`   | _string_[]                        | -             |
| `options` | [_Options_](#interfacesoptionsmd) | ...           |

**Returns:** _Promise_<_void_\>

Defined in: main.ts:30

---

### enable

▸ **enable**(`paths`: _string_[], `options?`: [_Options_](#interfacesoptionsmd)): _Promise_<_void_\>

#### Parameters:

| Name      | Type                              | Default value |
| --------- | --------------------------------- | ------------- |
| `paths`   | _string_[]                        | -             |
| `options` | [_Options_](#interfacesoptionsmd) | ...           |

**Returns:** _Promise_<_void_\>

Defined in: main.ts:26

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

• `Optional` **addEntry**: _undefined_ \| [_OnAddEntry_](#onaddentry)

Defined in: index.ts:23

---

### delete

• `Optional` **delete**: _undefined_ \| [_OnDelete_](#ondelete)

Defined in: index.ts:22

---

### deleteEntry

• `Optional` **deleteEntry**: _undefined_ \| [_OnDeleteEntry_](#ondeleteentry)

Defined in: index.ts:24

---

### found

• `Optional` **found**: _undefined_ \| [_OnFound_](#onfound)

Defined in: index.ts:17

---

### move

• `Optional` **move**: _undefined_ \| [_OnMove_](#onmove)

Defined in: index.ts:19

---

### moveFail

• `Optional` **moveFail**: _undefined_ \| [_OnMoveFail_](#onmovefail)

Defined in: index.ts:20

---

### notFound

• `Optional` **notFound**: _undefined_ \| [_OnNotFound_](#onnotfound)

Defined in: index.ts:18

---

### symlink

• `Optional` **symlink**: _undefined_ \| [_OnSymlink_](#onsymlink)

Defined in: index.ts:21

<a name="interfacesoptionsmd"></a>

[not-sync](#readmemd) / Options

# Interface: Options

## Hierarchy

- **Options**

## Table of contents

### Properties

- [cwd](#cwd)
- [dry](#dry)
- [ignoreConfigs](#ignoreconfigs)
- [linkSameDir](#linksamedir)
- [on](#on)
- [roots](#roots)
- [targetRoots](#targetroots)
- [verbose](#verbose)

## Properties

### cwd

• `Optional` **cwd**: _undefined_ \| _string_

Defined in: index.ts:28

---

### dry

• `Optional` **dry**: _undefined_ \| _boolean_

Defined in: index.ts:30

---

### ignoreConfigs

• `Optional` **ignoreConfigs**: _undefined_ \| _string_ \| _string_[]

Defined in: index.ts:29

---

### linkSameDir

• `Optional` **linkSameDir**: _undefined_ \| _boolean_

Defined in: index.ts:35

---

### on

• `Optional` **on**: _undefined_ \| [_Events_](#interfaceseventsmd)

Defined in: index.ts:31

---

### roots

• `Optional` **roots**: _undefined_ \| _Partial_<_Record_<[_ServiceKey_](#servicekey), _string_\>\>

Defined in: index.ts:33

---

### targetRoots

• `Optional` **targetRoots**: _undefined_ \| _Partial_<_Record_<[_ServiceKey_](#servicekey), _string_\>\>

Defined in: index.ts:34

---

### verbose

• `Optional` **verbose**: _undefined_ \| _boolean_

Defined in: index.ts:32
