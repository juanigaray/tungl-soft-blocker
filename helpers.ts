// ECMA has forsaken us. We are on our own. I have written this function countless times.
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// Have courage
export const logMap = <T>(whatIShouldDo: (t: T) => void) => (whatIHaveBeenGiven: T) => {
    whatIShouldDo(whatIHaveBeenGiven);
    return whatIHaveBeenGiven;
};
