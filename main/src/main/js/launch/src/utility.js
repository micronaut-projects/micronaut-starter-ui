export const OS_NIX = '*nix'
export const OS_WINDOWS = "win"


export const osOpts = [
  {value: "*nix", label: "Unix/Linux/macOS"},
  {value: "win", label: "Windows"},
]

export const guessOs = () => {
  const { appVersion} = window.navigator
  if (appVersion.indexOf("Linux") !== -1) return OS_NIX;
  if (appVersion.indexOf("Mac") !== -1) return OS_NIX;
  if (appVersion.indexOf("X11") !== -1) return OS_NIX;
  if (appVersion.indexOf("Win") !== -1) return OS_WINDOWS;
  return ""
}

export const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const downloadBlob = (blob, name = "file.txt") => {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();
};

export const debounceResponse = (start, atLeast = 700) => (response) => {
    const end = Date.now();
    const diff = end - start;
    return new Promise((r) => {
        setTimeout(() => {
            r(response);
        }, Math.max(atLeast - diff, 0));
    });
};

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const takeAtLeast = async (fn, atLeast = 1000) => {
  const start = Date.now();
  let results, error;

  try {
    results = await fn();
  } catch (err) {
    error = err;
  }
  const end = Date.now();
  const minWait = atLeast - (end - start);
  if (minWait > 0) {
    await wait(minWait);
  }
  if (error) throw error;
  return results;
};


export const makeNodeTree = (data) => {
    let nodes = {};
    let obj = data;
    let node = nodes;
    let keys = Object.keys(obj);
    for (let k = 0; k < keys.length; k++) {
        let key = keys[k];
        let folders = key.split("/");
        let rootNode = node;
        for (let i = 0; i < folders.length; i++) {
            if (i === folders.length - 1) {
                node[folders[i]] = obj[key];
            } else {
                node[folders[i]] = node[folders[i]] || {};
                node = node[folders[i]];
            }
        }
        node = rootNode;
    }
    return nodes;
};

export const responseHandler = (type = "json") => (response) => {
    if (!response.ok) {
        throw response;
    }
    return response[type]();
};

export const copyToClipboard = async (str) => {
  if(window.navigator.clipboard) {
      return window.navigator.clipboard.writeText(str)
  }

  return new Promise((resolve, reject)=>{
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('Copy');
      setTimeout(()=>{
          document.body.removeChild(el);
          resolve()
      }, 0)
  })
};
