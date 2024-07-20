(() => {
  // index.ts
  var TUNGL_BLOCKER_STORAGE_KEY = "tungl-blocker-data";
  var getBlockerStorage = () => JSON.parse(localStorage.getItem(TUNGL_BLOCKER_STORAGE_KEY) ?? "");
  var blockerStorageIsValid = () => {
    const storage = getBlockerStorage();
    const followersAreObject = typeof storage.followers === "object";
    const whitelistedUsersAreObject = typeof storage.whitelistedUsers === "object";
    return followersAreObject && whitelistedUsersAreObject && storage.followers !== null && storage.whitelistedUsers !== null;
  };
  if (!blockerStorageIsValid()) {
    localStorage.setItem(TUNGL_BLOCKER_STORAGE_KEY, JSON.stringify({
      whitelistedUsers: {},
      followers: {}
    }));
  }
  var setWhitelist = (whitelist) => {
    const blockerStorage = getBlockerStorage();
    localStorage.setItem(TUNGL_BLOCKER_STORAGE_KEY, JSON.stringify({ ...blockerStorage, whitelistedUsers: whitelist }));
  };
  var setUserWhitelistStatus = (status) => (userIdentifier) => {
    const whitelistedUsers = getBlockerStorage().whitelistedUsers;
    whitelistedUsers[userIdentifier] = status;
    setWhitelist(whitelistedUsers);
  };
  var whitelistUser = setUserWhitelistStatus(true);
  var deWhitelistUser = setUserWhitelistStatus(false);
})();
