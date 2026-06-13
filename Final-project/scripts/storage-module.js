export function savePreference(keyName, valueData) {
    try {
        localStorage.setItem(keyName, JSON.stringify(valueData));
    } catch(err) {
        console.error("State preference tracking denied by browser security policies.", err);
    }
}

export function getPreference(keyName) {
    const rawData = localStorage.getItem(keyName);
    return rawData ? JSON.parse(rawData) : null;
}