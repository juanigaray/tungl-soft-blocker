// @ts-check
// Open https://www.tumblr.com/blog/YOUR BLOG URL HERE/followers
// Do it with Firefox. This will not work on Chrome or Safari.
// Paste this code on your console and press Return

// ECMA has forsaken us. We are on our own. I have written this function countless times.
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Have courage
const logMap = whatIShouldDo => whatIHaveBeenGiven => {
    whatIShouldDo(whatIHaveBeenGiven);
    return whatIHaveBeenGiven;
};

// This path is shared by the Followers and the Confirmation.
const commonRootXpath = `/html/body/div/div/div/`;
// There is a <section> element that represents the page of followers that you're seeing.
// It has a single child, a div. This is the path of the div.
const sectionXPath = `${commonRootXpath}div[2]/div/div[2]/div/div[1]/main/section/div`;
// Of the sections's div's path, you extract the Element. From the Element, you extract the Children. 
const childrenOfFirstChildOfSection = Array.from($x(sectionXPath)?.[0]?.childNodes);
// Each row a Follower
const followers = childrenOfFirstChildOfSection
    .filter(row => row.childNodes[0].childNodes.length === 3).map(row => row.childNodes[0]);

const rowToPopupButton = row => {
    /* The Follower has three Children.
     * The first child can show you to the Follower.
     * The second child speaks of the Follower.
     * The third child asks you what you need.
     * You need the third child.
     */
    const divWithSpanInside = row.childNodes[2].childNodes[0];
    // Again the last child holds the answer
    const threeDotsDiv = divWithSpanInside.childNodes[divWithSpanInside.childNodes.length - 1];
    const openPopupButton = threeDotsDiv.childNodes[0].childNodes[0];
    return openPopupButton;
};

const getConfirmationBtn = (idx) => $x(`${commonRootXpath}div[4]/div[2]/div[2]/div/div[2]/button[${idx}]`)[0];

const popupButtonToPromiseOfUserConfirmationOfblock = (openPopupButton) => async () => {
    openPopupButton.click();
    // The popup takes some time to show up. We need to wait before we search its contents.
    await sleep(300);
    const blockBtn = $x(`${commonRootXpath}div[4]/div/div/div/button`)[0];
    blockBtn.click();
    await sleep(300);
    const nvmBtn = getConfirmationBtn(1);
    const okBtn = getConfirmationBtn(2);
    return new Promise(resolve => {
        nvmBtn.addEventListener("click", resolve);
        okBtn.addEventListener("click", async () => {
            await sleep(200);
            const confirmButton = $x("/html/body/div/div/div/div[4]/div[2]/div[2]/div/div[2]/button")[0];
            confirmButton.click();
            await sleep(200);
            resolve();
        });
    })
};

const confirmations = followers
    .map(rowToPopupButton)
    .map(popupButtonToPromiseOfUserConfirmationOfblock);

const confirmEveryBlockInOrder = async () => {
    for (const confirmation of confirmations) {
        await confirmation();
    }
}

confirmEveryBlockInOrder();