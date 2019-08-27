window.addEventListener("DOMContentLoaded", event => {
  document.getElementById("button").addEventListener("click", () => {
    clickSubmit();
  });
});

const clickSubmit = () => {
  const EC = require("elliptic").ec;
  const sha256 = require("js-sha256");
  const ripemd160 = require("ripemd160");
  const bs58 = require("bs58");
  // Create and initialize EC context
  // (better do it once and reuse it)
  const ec = new EC("secp256k1");
  // Generate keys
  let key = ec.genKeyPair();
  let privateKey = key.getPrivate("hex");
  let publicKey = key.getPublic("hex");
  let hash = sha256(Buffer.from(publicKey, "hex"));
  let publicKeyHash = new ripemd160().update(Buffer.from(hash, "hex")).digest();
  function createPublicAddress(publicKeyHash) {
    // step 1 - add prefix "00" in hex
    const step1 = Buffer.from("00" + publicKeyHash.toString("hex"), "hex");
    // step 2 - create SHA256 hash of step 1
    const step2 = sha256(step1);
    // step 3 - create SHA256 hash of step 2
    const step3 = sha256(Buffer.from(step2, "hex"));
    // step 4 - find the 1st byte of step 3 - save as "checksum"
    const checksum = step3.substring(0, 8);
    // step 5 - add step 1 + checksum
    const step4 = step1.toString("hex") + checksum;
    // return base 58 encoding of step 5
    const address = bs58.encode(Buffer.from(step4, "hex"));
    return address;
  }
  function createPrivateKeyWIF(privateKey) {
    const step1 = Buffer.from("80" + privateKey, "hex");
    const step2 = sha256(step1);
    const step3 = sha256(Buffer.from(step2, "hex"));
    const checksum = step3.substring(0, 8);
    const step4 = step1.toString("hex") + checksum;
    const privateKeyWIF = bs58.encode(Buffer.from(step4, "hex"));
    return privateKeyWIF;
  }
  document.getElementById("publicKey").innerHTML = publicKey;
  document.getElementById("privateKey").innerHTML = privateKey;
  document.getElementById("adress").innerHTML = createPublicAddress(
    publicKeyHash
  );
  document.getElementById("privateWIF").innerHTML = createPrivateKeyWIF(
    privateKey
  );
};
