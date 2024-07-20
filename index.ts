const TUNGL_BLOCKER_STORAGE_KEY = "tungl-blocker-data";

const getBlockerStorage = (): { whitelistedUsers: Record<string, boolean>, followers: Record<string, boolean> } => JSON.parse(localStorage.getItem(TUNGL_BLOCKER_STORAGE_KEY) ?? "");

const blockerStorageIsValid = (): boolean => {
    const storage = getBlockerStorage();
    const followersAreObject = typeof storage.followers === 'object';
    const whitelistedUsersAreObject = typeof storage.whitelistedUsers === 'object';
    return followersAreObject && whitelistedUsersAreObject && storage.followers !== null && storage.whitelistedUsers !== null;
}

if (!blockerStorageIsValid()) {
    // initialize state
    localStorage.setItem(TUNGL_BLOCKER_STORAGE_KEY, JSON.stringify({
        whitelistedUsers: {},
        followers: {}
    }));
}

const setWhitelist = (whitelist: Record<string, boolean>): void => {
    const blockerStorage = getBlockerStorage();
    localStorage.setItem(TUNGL_BLOCKER_STORAGE_KEY, JSON.stringify({ ...blockerStorage, whitelistedUsers: whitelist }));
}
const setUserWhitelistStatus = (status: boolean) => (userIdentifier: string): void => {
    const whitelistedUsers = getBlockerStorage().whitelistedUsers;
    whitelistedUsers[userIdentifier] = status;
    setWhitelist(whitelistedUsers);
}
const whitelistUser = setUserWhitelistStatus(true);
const deWhitelistUser = setUserWhitelistStatus(false);
