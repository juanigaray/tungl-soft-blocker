const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const logMap = (whatIShouldDo) => (whatIHaveBeenGiven) => {
    whatIShouldDo(whatIHaveBeenGiven);
    return whatIHaveBeenGiven;
};
const TUNGL_BLOCKER_STORAGE_KEY = "tungl-blocker-data";
localStorage.setItem(TUNGL_BLOCKER_STORAGE_KEY, JSON.stringify({
    blockedUsers: {}
}));
const saveUserBlockage = (userIdentifier) => {
    const currentState = JSON.parse(localStorage.getItem(TUNGL_BLOCKER_STORAGE_KEY) ?? "");
    const blockedUsers = currentState.blockedUsers;
    blockedUsers[userIdentifier] = true;
    localStorage.setItem(TUNGL_BLOCKER_STORAGE_KEY, JSON.stringify({ ...currentState, blockedUsers }));
};
const commonRootXpath = `/html/body/div/div/div/`;
const sectionXPath = `${commonRootXpath}div[2]/div/div[2]/div/div[1]/main/section/div`;
const childrenOfFirstChildOfSection = Array.from($x(sectionXPath)?.[0]?.childNodes);
const followers = childrenOfFirstChildOfSection
    .filter(row => row.childNodes[0].childNodes.length === 3).map(row => row.childNodes[0]);
const followerRowToBlogName = (row) => {
    return row.childNodes[1].childNodes[0].childNodes[1].childNodes[0].textContent.trim();
};
const followerRowToPopupButton = (row) => {
    const divWithSpanInside = row.childNodes[2].childNodes[0];
    const threeDotsDiv = divWithSpanInside.childNodes[divWithSpanInside.childNodes.length - 1];
    const openPopupButton = threeDotsDiv.childNodes[0].childNodes[0];
    return openPopupButton;
};
const getConfirmationBtn = (idx) => $x(`${commonRootXpath}div[4]/div[2]/div[2]/div/div[2]/button[${idx}]`)[0];
const popupButtonAndUsernameToPromiseOfUserConfirmationOfBlock = ([openPopupButton, usernameOfFollower]) => async () => {
    openPopupButton.click();
    await sleep(300);
    const blockBtn = $x(`${commonRootXpath}div[4]/div/div/div/button`)[0];
    blockBtn.click();
    await sleep(300);
    const nvmBtn = getConfirmationBtn(1);
    const okBtn = getConfirmationBtn(2);
    return (new Promise(resolve => {
        nvmBtn.addEventListener("click", () => resolve());
        okBtn.addEventListener("click", async () => {
            await sleep(200);
            const confirmButton = $x("/html/body/div/div/div/div[4]/div[2]/div[2]/div/div[2]/button")[0];
            confirmButton.click();
            saveUserBlockage(usernameOfFollower);
            await sleep(200);
            resolve();
        });
    }));
};
const confirmations = followers
    .map(followerRow => [followerRowToPopupButton(followerRow), followerRowToBlogName(followerRow)])
    .map(buttonUsernameTuple => popupButtonAndUsernameToPromiseOfUserConfirmationOfBlock(buttonUsernameTuple));
const confirmEveryBlockInOrder = async () => {
    for (const confirmation of confirmations) {
        await confirmation();
    }
};
confirmEveryBlockInOrder();
